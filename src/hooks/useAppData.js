import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useAppData() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pointValue, setPointValue] = useState(0.10);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [storeSettings, setStoreSettings] = useState({});
    const [rewardProducts, setRewardProducts] = useState([]);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Dynamic import to avoid circular dependencies if any, though not strictly necessary here
            const { ContentService } = await import('../services/content');

            const [productsData, categoriesData, settingsData, couponsData, rewardsData] = await Promise.all([
                api.products.getAll(),
                api.products.getCategories(),
                ContentService.getSettings(),
                ContentService.getCoupons(),
                ContentService.getRewardProducts()
            ]);

            if (settingsData) {
                setStoreSettings(settingsData);
                if (settingsData.pointValue) {
                    setPointValue(Number(settingsData.pointValue));
                }
            }

            // Deduplicate products by ID
            const uniqueProducts = Array.from(new Map(productsData.map(item => [item.id, item])).values());

            // Deduplicate categories by ID
            const uniqueCategories = Array.from(new Map(categoriesData.map(item => [item.id, item])).values());

            setProducts(uniqueProducts);
            setCategories(uniqueCategories);
            setAvailableCoupons(couponsData || []);
            setRewardProducts(rewardsData || []);
            setError(null);
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err);
        } finally {
            setIsDataLoaded(true);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        products,
        categories,
        isDataLoaded,
        isLoading,
        pointValue,
        availableCoupons,
        storeSettings,
        rewardProducts,
        error,
        refreshData: loadData
    };
}
