import { useState, useMemo, useEffect } from 'react';
import { createFuseInstance, processSearchQuery } from '../utils/searchUtils';

export function useProductSearch(products, categories) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [sortOrder, setSortOrder] = useState(null); // null, 'asc', 'desc'
    const [visibleCount, setVisibleCount] = useState(20);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(20);
    }, [selectedCategory, selectedSubcategory, searchQuery]);

    const filteredProducts = useMemo(() => {
        let result = products;

        if (searchQuery) {
            const processedQuery = processSearchQuery(searchQuery);
            const fuse = createFuseInstance(products);
            const searchResults = fuse.search(processedQuery);
            result = searchResults.map(r => r.item);
        } else {
            if (selectedCategory) {
                result = result.filter(product => product.category === selectedCategory);
            }
            if (selectedSubcategory) {
                result = result.filter(product => product.subcategory === selectedSubcategory);
            }
        }

        return [...result].sort((a, b) => {
            if (sortOrder === 'asc') return a.price - b.price;
            if (sortOrder === 'desc') return b.price - a.price;
            return 0;
        });
    }, [products, selectedCategory, selectedSubcategory, searchQuery, sortOrder]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        const processedQuery = processSearchQuery(searchQuery).toLowerCase();
        return categories.filter(cat => cat.name.toLowerCase().includes(processedQuery));
    }, [categories, searchQuery]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSearchQuery('');
        setSortOrder(null);
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        sortOrder,
        setSortOrder,
        visibleCount,
        setVisibleCount,
        filteredProducts,
        filteredCategories,
        visibleProducts,
        clearFilters
    };
}
