import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

export function Flyer() {
    const [flyers, setFlyers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const loadFlyers = async () => {
            try {
                const { ContentService } = await import('../services/content');
                const data = await ContentService.getFlyers();
                setFlyers(data);
            } catch (error) {
                console.error("Error loading flyers:", error);
            }
        };
        loadFlyers();
    }, []);

    return (
        <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Folleto Digital 📰</h2>
            </div>

            {flyers.length > 0 ? (
                <div className="no-scrollbar" style={{
                    display: 'flex',
                    gap: '1rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem',
                    scrollSnapType: 'x mandatory'
                }}>
                    {flyers.map(flyer => (
                        <div
                            key={flyer.id}
                            onClick={() => setSelectedImage(flyer.imageUrl)}
                            style={{
                                minWidth: '280px',
                                maxWidth: '320px',
                                flex: '0 0 auto',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                scrollSnapAlign: 'start',
                                cursor: 'pointer'
                            }}
                        >
                            <img src={flyer.imageUrl} alt="Folleto Digital" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    border: '2px dashed #d1d5db',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                    <FileText size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Folleto no disponible</h3>
                    <p style={{ color: '#6b7280', margin: 0 }}>Estamos preparando las mejores ofertas para ti.</p>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Folleto Expandido"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            borderRadius: '8px'
                        }}
                    />
                    <button
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
}
