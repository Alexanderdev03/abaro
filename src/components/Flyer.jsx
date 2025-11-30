import React from 'react';
import { FileText } from 'lucide-react';

export function Flyer() {
    return (
        <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Folleto Digital 📰</h2>
            </div>

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
        </div>
    );
}
