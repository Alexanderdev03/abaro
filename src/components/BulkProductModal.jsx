import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Scale, FileText } from 'lucide-react';

export function BulkProductModal({ product, onClose, onAdd }) {
    const [mode, setMode] = useState('weight'); // 'weight' | 'unit'
    const [weight, setWeight] = useState(1.0); // in kg
    const [quantity, setQuantity] = useState(1); // units
    const [notes, setNotes] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleWeightChange = (val) => {
        setWeight(parseFloat(val));
    };

    const handleQuantityChange = (delta) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    const calculateTotal = () => {
        if (mode === 'weight') {
            return product.price * weight;
        } else {
            const unitWeight = product.averageWeight || 0;
            if (unitWeight > 0) {
                return product.price * (quantity * unitWeight);
            } else {
                return product.price * quantity;
            }
        }
    };

    const calculateApproxWeight = () => {
        if (mode === 'unit' && product.averageWeight) {
            return (quantity * product.averageWeight).toFixed(3);
        }
        return null;
    };

    const handleConfirm = () => {
        const finalPrice = calculateTotal();
        const finalWeight = mode === 'weight' ? weight : (quantity * (product.averageWeight || 0));

        onAdd({
            ...product,
            isBulkSelection: true,
            bulkMode: mode,
            quantity: mode === 'weight' ? 1 : quantity,
            cartQuantity: mode === 'weight' ? weight : quantity,
            cartUnit: mode === 'weight' ? 'kg' : 'pz',
            notes: notes,
            price: finalPrice / (mode === 'weight' ? 1 : quantity),
            totalPrice: finalPrice,
            weight: finalWeight
        });
        handleClose();
    };

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
            pointerEvents: 'none'
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
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
            }}>
                {/* Close Handle */}
                <div style={{
                    width: '40px',
                    height: '4px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px',
                    margin: '0 auto 1.5rem auto'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{product.name}</h3>
                    <button onClick={handleClose} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}>
                        <X size={24} color="#666" />
                    </button>
                </div>

                {product.averageWeight && (
                    <div style={{
                        display: 'flex',
                        backgroundColor: '#f3f4f6',
                        padding: '4px',
                        borderRadius: '12px',
                        marginBottom: '1.5rem'
                    }}>
                        <button
                            onClick={() => setMode('unit')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: mode === 'unit' ? 'white' : 'transparent',
                                boxShadow: mode === 'unit' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                fontWeight: '600',
                                color: mode === 'unit' ? 'var(--color-primary)' : '#666',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            Por Pieza
                        </button>
                        <button
                            onClick={() => setMode('weight')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: mode === 'weight' ? 'white' : 'transparent',
                                boxShadow: mode === 'weight' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                fontWeight: '600',
                                color: mode === 'weight' ? 'var(--color-primary)' : '#666',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            Por Kilo
                        </button>
                    </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                    {mode === 'unit' ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <Minus size={20} />
                            </button>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{quantity} Pieza{quantity > 1 ? 's' : ''}</div>
                                {product.averageWeight && (
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        Aprox. {calculateApproxWeight()} kg
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <button
                                    onClick={() => setWeight(Math.max(0.05, weight - 0.05))}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <Minus size={20} />
                                </button>
                                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weight.toFixed(3)} kg</div>
                                </div>
                                <button
                                    onClick={() => setWeight(weight + 0.05)}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', minHeight: '50px' }}>
                                {(() => {
                                    let suggestions = [0.100, 0.250, 0.500, 1.000];
                                    if (product.bulkSuggestions && typeof product.bulkSuggestions === 'string' && product.bulkSuggestions.trim().length > 0) {
                                        const parsed = product.bulkSuggestions.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                                        if (parsed.length > 0) suggestions = parsed;
                                    }

                                    return suggestions.map(w => (
                                        <button
                                            key={w}
                                            onClick={() => setWeight(w)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '20px',
                                                border: Math.abs(weight - w) < 0.001 ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                                backgroundColor: Math.abs(weight - w) < 0.001 ? '#eff6ff' : 'white',
                                                color: Math.abs(weight - w) < 0.001 ? 'var(--color-primary)' : '#666',
                                                fontWeight: '500',
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer',
                                                flexShrink: 0
                                            }}
                                        >
                                            {w >= 1 ? `${w} kg` : `${w * 1000}g`}
                                        </button>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        <FileText size={16} />
                        Notas adicionales
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Rebanado delgado, bien maduro..."
                        rows={2}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <button
                    onClick={handleConfirm}
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                >
                    <span>Agregar al carrito</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                </button>
            </div>
        </div>
    );
}
