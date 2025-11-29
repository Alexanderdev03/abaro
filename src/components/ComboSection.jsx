import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';

export function ComboSection({ onAddCombo }) {
    const combos = [
        {
            id: 'combo-1',
            name: 'Pack Desayuno',
            description: 'Cereal + Leche + Café',
            price: 85.00,
            originalPrice: 110.00,
            image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=300&q=80',
            items: [
                { id: 'c-1-1', name: 'Cereal Maíz', price: 35, quantity: 1 },
                { id: 'c-1-2', name: 'Leche Entera', price: 25, quantity: 1 },
                { id: 'c-1-3', name: 'Café Soluble', price: 50, quantity: 1 }
            ]
        },
        {
            id: 'combo-2',
            name: 'Pack Limpieza',
            description: 'Detergente + Suavizante + Cloro',
            price: 120.00,
            originalPrice: 155.00,
            image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80',
            items: [
                { id: 'c-2-1', name: 'Detergente 1kg', price: 45, quantity: 1 },
                { id: 'c-2-2', name: 'Suavizante 1L', price: 35, quantity: 1 },
                { id: 'c-2-3', name: 'Cloro 2L', price: 20, quantity: 1 }
            ]
        },
        {
            id: 'combo-3',
            name: 'Pack Fiesta',
            description: 'Refrescos + Papas + Vasos',
            price: 150.00,
            originalPrice: 190.00,
            image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&w=300&q=80',
            items: [
                { id: 'c-3-1', name: 'Refresco Cola 3L', price: 40, quantity: 2 },
                { id: 'c-3-2', name: 'Papas Fritas', price: 45, quantity: 2 },
                { id: 'c-3-3', name: 'Vasos Desechables', price: 20, quantity: 1 }
            ]
        }
    ];

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Combos Morralla 💰
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '600' }}>Ver todos</span>
            </div>

            <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                scrollSnapType: 'x mandatory'
            }} className="no-scrollbar">
                {combos.map(combo => (
                    <div key={combo.id} style={{
                        minWidth: '260px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        scrollSnapAlign: 'start',
                        border: '1px solid #eee'
                    }}>
                        <div style={{ position: 'relative', height: '140px' }}>
                            <img
                                src={combo.image}
                                alt={combo.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                Ahorras ${combo.originalPrice - combo.price}
                            </div>
                        </div>

                        <div style={{ padding: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{combo.name}</h4>
                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#666' }}>{combo.description}</p>

                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>
                                        ${combo.originalPrice.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                        ${combo.price.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => onAddCombo(combo)}
                                    style={{
                                        backgroundColor: '#333',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Plus size={16} />
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
