import React from 'react';
import { Heart, Plus } from 'lucide-react';
import './ProductCard.css';

export function ProductCard({ product, onAdd, isFavorite, onToggleFavorite, onClick, priority = false }) {
    return (
        <div
            onClick={onClick}
            className="product-card animate-scale-in"
        >
            {/* Badges */}
            <div style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                zIndex: 10
            }}>
                <button
                    className="product-card-favorite-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    style={{
                        color: isFavorite ? 'var(--color-accent)' : '#999'
                    }}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>
            </div>

            {product.originalPrice && (
                <div className="product-card-badge">
                    OFERTA
                </div>
            )}

            {/* Image */}
            <div className="product-card-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    loading={priority ? "eager" : "lazy"}
                    width="100%"
                    height="140"
                    className="product-card-image"
                />
            </div>

            {/* Content */}
            <div className="product-card-content">
                <h3 className="product-card-title">
                    {product.name}
                </h3>

                {product.originalPrice && (
                    <div className="product-card-original-price">
                        De: ${product.originalPrice.toFixed(2)}
                    </div>
                )}

                <div className="product-card-price">
                    ${product.price.toFixed(2)}
                </div>

                {product.bonusPoints && (
                    <div className="product-card-bonus">
                        <span>+{product.bonusPoints} Puntos</span>
                    </div>
                )}

                <button
                    className="product-card-add-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(product);
                    }}
                >
                    <Plus size={16} style={{ marginRight: '4px', strokeWidth: 3 }} />
                    Agregar
                </button>
            </div>
        </div>
    );
}
