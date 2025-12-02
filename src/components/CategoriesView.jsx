import React from 'react';
import { ShoppingBasket, Apple, Milk, SprayCan, Dog, Pill, Croissant, Baby } from 'lucide-react';
import { ProductCard } from './ProductCard';

const iconMap = {
    ShoppingBasket, Apple, Milk, SprayCan, Dog, Pill, Croissant, Baby
};

export function CategoriesView({
    filteredCategories,
    handleCategoryClick,
    searchQuery,
    filteredProducts,
    addToCart,
    handleOpenProduct,
    favorites,
    toggleFavorite
}) {
    return (
        <div style={{ marginTop: '1rem' }}>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
            }}>
                {filteredCategories.map(category => {
                    const Icon = iconMap[category.icon] || ShoppingBasket;
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.name)}
                            style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius)',
                                boxShadow: 'var(--shadow-sm)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)'
                            }}>
                                <Icon size={24} />
                            </div>
                            <span style={{ fontWeight: '600', color: '#333' }}>{category.name}</span>
                        </button>
                    );
                })}
            </div>

            {searchQuery && (
                <div style={{ marginTop: '2rem' }}>
                    {filteredProducts.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '1rem'
                        }}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={addToCart}
                                    onClick={() => handleOpenProduct(product)}
                                    isFavorite={favorites.some(f => f.id === product.id)}
                                    onToggleFavorite={() => toggleFavorite(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                            No se encontraron productos que coincidan con "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
