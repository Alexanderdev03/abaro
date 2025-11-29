import React from 'react';

export function Flyer() {
    const pages = [
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400&h=600",
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=400&h=600",
        "https://images.unsplash.com/photo-1472851294608-415105022054?auto=format&fit=crop&q=80&w=400&h=600"
    ];

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--color-primary)' }}>Folleto Digital 📰</h3>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Vigencia: 28 Nov - 05 Dic</span>
            </div>

            <div className="hide-scrollbar" style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollSnapType: 'x mandatory'
            }}>
                {pages.map((url, idx) => (
                    <div key={idx} style={{
                        minWidth: '280px',
                        height: '400px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        scrollSnapAlign: 'center',
                        boxShadow: 'var(--shadow-md)',
                        position: 'relative'
                    }}>
                        <img
                            src={url}
                            alt={`Página ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            padding: '1rem',
                            color: 'white'
                        }}>
                            <span style={{ fontWeight: 'bold' }}>Página {idx + 1}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
