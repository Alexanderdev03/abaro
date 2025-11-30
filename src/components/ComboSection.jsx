import React from 'react';
import { Layers } from 'lucide-react';

export function ComboSection() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Combos Morralla 🔥</h2>
            </div>

            <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                padding: '3rem 1rem',
                textAlign: 'center',
                border: '2px dashed #d1d5db'
            }}>
                <Layers size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Sección en Construcción</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Próximamente encontrarás los mejores combos aquí.</p>
            </div>
        </div>
    );
}
