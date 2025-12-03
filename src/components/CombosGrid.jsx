import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';

export function CombosGrid({ onAddCombo, onBack }) {
    const [combos, setCombos] = React.useState([]);

    React.useEffect(() => {
        const loadCombos = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const combosData = await ContentService.getCombos();
                setCombos(combosData);
            } catch (error) {
                console.error("Error loading combos:", error);
            }
        };
        loadCombos();
    }, []);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem' }}
                >
                    <ArrowLeft size={24} color="var(--color-primary)" />
                </button>
                <h2 style={{ margin: 0 }}>Todos los Combos 💰</h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1rem'
            }}>
                {combos.map(combo => (
                    <div key={combo.id} style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid #eee',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                            <img
                                src={combo.image}
                                alt={combo.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                -${(Number(combo.originalPrice) - Number(combo.price)).toFixed(0)}
                            </div>
                        </div>

                        <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{combo.name}</h4>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#666', flex: 1 }}>{combo.description}</p>

                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                        ${Number(combo.price).toFixed(2)}
                                    </span>
                                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem' }}>
                                        ${Number(combo.originalPrice).toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => onAddCombo(combo)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#333',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem'
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
