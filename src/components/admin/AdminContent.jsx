import React, { useState, useEffect } from 'react';
import { Image, Upload, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

export function AdminContent() {
    const [banners, setBanners] = useState([]);
    const [newBannerUrl, setNewBannerUrl] = useState('');
    const [newBannerTitle, setNewBannerTitle] = useState('');

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const { ContentService } = await import('../../services/content');
            const data = await ContentService.getBanners();
            setBanners(data);
        } catch (error) {
            console.error("Error loading banners:", error);
        }
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();
        if (!newBannerUrl) return;

        const newBanner = {
            imageUrl: newBannerUrl,
            title: newBannerTitle || 'Promoción',
            color: '#3b82f6', // Default color fallback
            textColor: 'white',
            createdAt: new Date().toISOString()
        };

        try {
            const { ContentService } = await import('../../services/content');
            await ContentService.addBanner(newBanner);
            loadBanners();
            setNewBannerUrl('');
            setNewBannerTitle('');
            alert('Banner agregado correctamente');
        } catch (error) {
            alert('Error al guardar el banner');
        }
    };

    const handleDeleteBanner = async (id) => {
        if (!window.confirm('¿Eliminar este banner?')) return;
        try {
            const { ContentService } = await import('../../services/content');
            await ContentService.deleteBanner(id);
            loadBanners();
        } catch (error) {
            alert('Error al eliminar el banner');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Banners Section */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Banners Principales</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Agrega imágenes para el carrusel de la página de inicio. Si no hay banners, se mostrarán los predeterminados.
                    </p>
                </div>

                {/* Add Banner Form */}
                <form onSubmit={handleAddBanner} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>URL de la Imagen</label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="url"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={newBannerUrl}
                                onChange={e => setNewBannerUrl(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>Título (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ej. Ofertas de Verano"
                            value={newBannerTitle}
                            onChange={e => setNewBannerTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#3b82f6', color: 'white', border: 'none',
                            padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', height: '46px'
                        }}
                    >
                        <Plus size={18} />
                        Agregar
                    </button>
                </form>

                {/* Banners List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {banners.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
                            No hay banners personalizados. Se están mostrando los predeterminados.
                        </div>
                    ) : (
                        banners.map((banner) => (
                            <div key={banner.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ height: '140px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Error+Imagen' }}
                                    />
                                    <button
                                        onClick={() => handleDeleteBanner(banner.id)}
                                        style={{
                                            position: 'absolute', top: '8px', right: '8px',
                                            backgroundColor: 'rgba(255,255,255,0.9)', color: '#ef4444',
                                            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {banner.title}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>Activo</div>
                                </div>
                            </div>
                        ))
                    )}
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
