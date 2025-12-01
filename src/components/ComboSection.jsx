import React, { useState, useEffect } from 'react';
import { Layers, Plus, ShoppingBag } from 'lucide-react';

export function ComboSection({ onAddCombo, onSeeAll }) {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCombos = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const data = await ContentService.getCombos();
                setCombos(data);
            } catch (error) {
                console.error("Error loading combos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCombos();
    }, []);

    if (loading) return null;
    if (combos.length === 0) return null;

    return (
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>Combos Morralla 🔥</h3>
                </div>
                {onSeeAll && (
                    <button
                        onClick={onSeeAll}
                        style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        Ver todos
                    </button>
                )}
            </div>

            <div className="no-scrollbar" style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                scrollSnapType: 'x mandatory'
            }}>
                {combos.map(combo => (
                    <div key={combo.id} style={{
                        minWidth: '280px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid #eee',
                        scrollSnapAlign: 'start',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {combo.imageUrl && (
                            <div style={{ height: '140px', overflow: 'hidden' }}>
                                <img src={combo.imageUrl} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{combo.name}</h4>
                                <span style={{
                                    backgroundColor: '#fee2e2',
                                    color: '#ef4444',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    ${Number(combo.price).toFixed(2)}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 1rem 0', flex: 1 }}>
                                {combo.description}
                            </p>

                            {combo.items && combo.items.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>Incluye:</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                        {combo.items.slice(0, 3).map((item, idx) => (
                                            <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                                {item.quantity}x {item.name}
                                            </span>
                                        ))}
                                        {combo.items.length > 3 && (
                                            <span style={{ fontSize: '0.75rem', color: '#666' }}>+{combo.items.length - 3} más</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => onAddCombo(combo)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <ShoppingBag size={18} />
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
