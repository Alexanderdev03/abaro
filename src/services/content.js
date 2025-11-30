import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export const ContentService = {
    getBanners: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "banners"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },

    addBanner: async (bannerData) => {
        try {
            const docRef = await addDoc(collection(db, "banners"), bannerData);
            return { id: docRef.id, ...bannerData };
        } catch (error) {
            console.error("Error adding banner:", error);
            throw error;
        }
    },

    deleteBanner: async (id) => {
        try {
            await deleteDoc(doc(db, "banners", id));
            return true;
        } catch (error) {
            console.error("Error deleting banner:", error);
            throw error;
        }
    }
};
