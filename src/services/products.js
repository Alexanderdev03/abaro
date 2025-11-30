import { db } from '../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, limit, startAfter, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { products as localProducts, categories as localCategories } from '../data/products';

// Toggle this to switch between Local Data and Firebase
const USE_FIREBASE = true;

export const ProductService = {
  // Old method kept for compatibility if needed, but we'll use the new one
  getAllProducts: async () => {
    if (!USE_FIREBASE) {
      return new Promise(resolve => setTimeout(() => resolve(localProducts), 500));
    }
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: !isNaN(Number(doc.id)) ? Number(doc.id) : doc.id
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  /**
   * Fetch products with server-side pagination and filtering
   * @param {Object} params
   * @param {number} params.limitPerPage - Number of items to fetch
   * @param {Object} params.lastVisible - The last document from the previous page (for pagination)
   * @param {string} params.searchTerm - Search term for name
   * @param {string} params.category - Category filter
   * @param {string} params.stockFilter - 'low', 'out', or 'all'
   */
  getProductsPaginated: async ({ limitPerPage = 10, lastVisible = null, searchTerm = '', category = '', stockFilter = 'all' }) => {
    try {
      let constraints = [];
      const productsRef = collection(db, "products");

      // 1. Base Ordering
      // Firestore requires the field used in range/inequality filters to be the first in orderBy
      if (searchTerm) {
        constraints.push(orderBy('name'));
        constraints.push(startAt(searchTerm));
        constraints.push(endAt(searchTerm + '\uf8ff'));
      } else {
        constraints.push(orderBy('createdAt', 'desc'));
      }

      // 2. Category Filter
      if (category) {
        constraints.push(where('category', '==', category));
      }

      // 3. Stock Filter
      if (stockFilter === 'low') {
        constraints.push(where('stock', '<', 5));
      } else if (stockFilter === 'out') {
        constraints.push(where('stock', '==', 0));
      }

      // 4. Pagination
      if (lastVisible) {
        constraints.push(startAfter(lastVisible));
      }

      // 5. Limit
      constraints.push(limit(limitPerPage));

      // Execute Query
      const q = query(productsRef, ...constraints);
      const snapshot = await getDocs(q);

      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        products,
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitPerPage
      };

    } catch (error) {
      console.error("Error fetching paginated products:", error);
      throw error;
    }
  },

  getAllCategories: async () => {
    if (!USE_FIREBASE) return localCategories;
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      if (querySnapshot.empty) {
        // Auto-seed if empty so we have deletable documents
        console.log("Auto-seeding categories to Firestore...");
        const seededCategories = [];
        const categoriesRef = collection(db, "categories");

        for (const cat of localCategories) {
          try {
            const docRef = await addDoc(categoriesRef, cat);
            seededCategories.push({ id: docRef.id, ...cat });
          } catch (e) {
            console.error("Error seeding category:", e);
          }
        }
        return seededCategories.length > 0 ? seededCategories : localCategories;
      }
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return localCategories;
    }
  },

  addCategory: async (categoryData) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), categoryData);
      return { id: docRef.id, ...categoryData };
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const categoryRef = doc(db, "categories", String(id));
      await updateDoc(categoryRef, categoryData);
      return { id, ...categoryData };
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const categoryRef = doc(db, "categories", String(id));
      await deleteDoc(categoryRef);
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  // CRUD Operations
  addProduct: async (productData) => {
    try {
      const productsRef = collection(db, "products");
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      console.log(`[ProductService] Updating product ${id} with data:`, productData);
      const productRef = doc(db, "products", String(id));
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      console.log(`[ProductService] Update successful for ${id}`);
      return { id, ...productData };
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const productRef = doc(db, "products", String(id));
      await deleteDoc(productRef);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Utility to upload local data to Firebase
  seedDatabase: async (onLog = console.log) => {
    onLog("Iniciando conexión con Firebase...");

    let successCount = 0;
    let errorCount = 0;

    for (const product of localProducts) {
      try {
        // Use setDoc to specify the ID, preventing duplicates and allowing updates
        const docRef = doc(db, "products", String(product.id));

        const { id, ...productData } = product;
        const dataToUpload = {
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(docRef, dataToUpload);
        onLog(`✅ Subido/Actualizado: ${product.name}`);
        successCount++;
      } catch (e) {
        onLog(`❌ Error al subir ${product.name}: ${e.message}`);
        errorCount++;
      }
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    }
    onLog(`🏁 Proceso finalizado. Exitosos: ${successCount}, Errores: ${errorCount}`);
  },

  deleteAllProducts: async () => {
    try {
      const productsRef = collection(db, "products");
      const pSnapshot = await getDocs(productsRef);

      const deletePromises = [];
      pSnapshot.docs.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error deleting all products:", error);
      throw error;
    }
  },

  removeDuplicateCategories: async () => {
    try {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);

      if (snapshot.empty) return 0;

      const categoriesByName = {};
      const duplicatesToDelete = [];

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Handle potential missing name
        const name = data.name ? data.name.trim().toLowerCase() : '';

        if (name && categoriesByName[name]) {
          // Found a duplicate, mark for deletion
          duplicatesToDelete.push(doc.ref);
        } else if (name) {
          // First time seeing this name, keep it
          categoriesByName[name] = true;
        }
      });

      if (duplicatesToDelete.length > 0) {
        console.log(`Found ${duplicatesToDelete.length} duplicate categories. Deleting...`);
        await Promise.all(duplicatesToDelete.map(ref => deleteDoc(ref)));
      }

      return duplicatesToDelete.length;
    } catch (error) {
      console.error("Error removing duplicate categories:", error);
      throw error;
    }
  }
};
