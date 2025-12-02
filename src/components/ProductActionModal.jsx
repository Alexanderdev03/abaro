import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';

export function ProductActionModal({ product, onClose, onAdd, products, onProductSelect }) {
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const totalPrice = product.price * quantity;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pointerEvents: 'none' // Allow clicks to pass through to backdrop
        }}>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'auto'
                }}
            />

            {/* Bottom Sheet */}
            <div style={{
                backgroundColor: 'white',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '1.5rem',
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'auto',
                position: 'relative',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
            }}>
                {/* Close Handle/Indicator */}
                <div style={{
                    width: '40px',
                    height: '4px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px',
                    margin: '0 auto 1.5rem auto'
                }} />

                {/* Product Header */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '12px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '0.5rem',
                            lineHeight: '1.3'
                        }}>
                            {product.name}
                        </h2>
                        <div style={{
                            fontSize: '0.9rem',
                            color: '#666'
                        }}>
                            Precio unitario: ${product.price.toFixed(2)}
                        </div>
                        {product.bonusPoints && (
                            <div style={{
                                fontSize: '0.8rem',
                                color: '#e65100',
                                fontWeight: 'bold',
                                marginTop: '0.25rem'
                            }}>
                                +{product.bonusPoints * quantity} Puntos
                            </div>
                        )}
                    </div>
                </div>

                {/* Quantity Selector */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                    backgroundColor: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '16px'
                }}>
                    <span style={{ fontWeight: '500', color: '#333' }}>Cantidad</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={decrement}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: quantity === 1 ? '#ccc' : '#333'
                            }}
                            disabled={quantity <= 1}
                        >
                            <Minus size={20} />
                        </button>

                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            width: '30px',
                            textAlign: 'center'
                        }}>
                            {quantity}
                        </span>

                        <button
                            onClick={increment}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--color-primary)'
                            }}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Total & Action Button */}
                <div style={{ paddingBottom: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <span style={{ fontSize: '1.1rem', color: '#666' }}>Total</span>
                        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                            ${totalPrice.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            onAdd(product, quantity);
                            handleClose();
                        }}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                            marginBottom: '2rem'
                        }}
                    >
                        <ShoppingCart size={24} />
                        Agregar al Carrito
                    </button>
                </div>

                {/* Related Products */}
                {products && (
                    <div style={{ paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>También te podría interesar</h3>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            paddingBottom: '1rem',
                            margin: '0 -1.5rem',
                            padding: '0 1.5rem 1rem 1.5rem'
                        }}>
                            {products
                                .filter(p => p.category === product.category && p.id !== product.id)
                                .slice(0, 4)
                                .map(related => (
                                    <div
                                        key={related.id}
                                        onClick={() => {
                                            if (onProductSelect) {
                                                onProductSelect(related);
                                            }
                                        }}
                                        style={{
                                            minWidth: '140px',
                                            width: '140px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            padding: '0.75rem',
                                            border: '1px solid #eee',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            flexShrink: 0
                                        }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '80px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <img
                                                src={related.image}
                                                alt={related.name}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <div>
                                            <p style={{
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                marginBottom: '0.25rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#333'
                                            }}>
                                                {related.name}
                                            </p>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                                ${related.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
