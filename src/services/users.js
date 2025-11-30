import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const UserService = {
    /**
     * Retrieves all unique customers from orders
     * @returns {Promise<Array>} - List of customers with metrics
     */
    async getAll() {
        try {
            const ordersRef = collection(db, 'orders');
            const snapshot = await getDocs(ordersRef);
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const customersMap = {};

            orders.forEach(order => {
                const email = order.customer?.email || order.email || 'unknown';
                if (!customersMap[email]) {
                    customersMap[email] = {
                        id: order.userId || email,
                        name: order.customer?.name || order.name || 'Cliente',
                        email: email,
                        phone: order.customer?.phone || order.phone || '',
                        orders: [],
                        totalSpent: 0,
                        lastOrderDate: null
                    };
                }

                customersMap[email].orders.push(order);
                customersMap[email].totalSpent += (order.total || 0);

                const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
                if (!customersMap[email].lastOrderDate || orderDate > customersMap[email].lastOrderDate) {
                    customersMap[email].lastOrderDate = orderDate;
                }
            });

            return Object.values(customersMap);
        } catch (e) {
            console.error("Error getting customers: ", e);
            return [];
        }
    },

    /**
     * Retrieves order history for a specific customer
     * @param {string} email - Customer email
     * @returns {Promise<Array>} - List of orders
     */
    async getHistory(email) {
        try {
            // We can reuse the logic from getAll or query specifically if we had a userId
            // For now, let's filter the orders collection by email if possible, or just client-side filter
            // Since we don't have an index on email guaranteed, client-side filtering from getAll might be safer for small scale,
            // but let's try a query.
            // Actually, to be safe and consistent with getAll, let's just fetch all orders and filter.
            // Optimization: In a real app, we'd index 'email' or 'userId'.

            const ordersRef = collection(db, 'orders');
            const snapshot = await getDocs(ordersRef);
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));

            return orders.filter(o => (o.customer?.email === email || o.email === email));
        } catch (e) {
            console.error("Error getting customer history: ", e);
            return [];
        }
    }
};
