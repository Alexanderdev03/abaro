import React from 'react';
import { Image, Upload, Plus } from 'lucide-react';

export function AdminContent() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Banners Section */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Banners Principales</h3>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
                    }}>
                        <Plus size={18} /> Nuevo Banner
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2].map((i) => (
                        <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ height: '140px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image size={32} color="#9ca3af" />
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Banner Promocional {i}</div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Activo</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flyer Section */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Folleto Digital</h3>
                <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '3rem', textAlign: 'center', cursor: 'pointer' }}>
                    <Upload size={32} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#4b5563', fontWeight: '500', marginBottom: '0.5rem' }}>Subir PDF o Imágenes del Folleto</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Arrastra y suelta archivos aquí</p>
                </div>
            </div>
        </div>
    );
}
