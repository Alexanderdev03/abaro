import React, { useState } from 'react';
import { Database, Upload, Check, AlertTriangle } from 'lucide-react';
import { ProductService } from '../services/products';

export function AdminPanel() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [logs, setLogs] = useState([]);

    const handleSeed = async () => {
        if (!window.confirm('¿Estás seguro? Esto subirá todos los productos locales a Firebase.')) return;

        setStatus('loading');
        setLogs(prev => [...prev, 'Iniciando carga de datos...']);

        try {
            // We temporarily enable Firebase mode for this operation if needed, 
            // or assume the service handles it. 
            // Note: The user must have set USE_FIREBASE = true in the service or we need a way to force it.
            // For this UI, we'll assume the service is ready or will warn us.

            await ProductService.seedDatabase((log) => {
                setLogs(prev => [...prev, log]);
            });

            setStatus('success');
            setLogs(prev => [...prev, '¡Carga completada con éxito!']);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setLogs(prev => [...prev, `Error: ${error.message}`]);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Database size={28} className="text-primary" />
                        Panel de Administración
                    </h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        v1.0.0
                    </span>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Gestión de Datos</h3>

                    <div style={{
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        backgroundColor: '#fafafa'
                    }}>
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Inicializar Base de Datos</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    Sube el catálogo de productos local a Firebase Firestore.
                                </p>
                            </div>
                            <button
                                onClick={handleSeed}
                                disabled={status === 'loading'}
                                className="btn btn-primary"
                                style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {status === 'loading' ? (
                                    <>Cargando...</>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Subir Productos
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Logs Console */}
                        <div style={{
                            backgroundColor: '#1e1e1e',
                            color: '#00ff00',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            padding: '1rem',
                            borderRadius: '6px',
                            height: '200px',
                            overflowY: 'auto',
                            marginTop: '1rem'
                        }}>
                            {logs.length === 0 ? (
                                <span style={{ opacity: 0.5 }}>Esperando comandos...</span>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} style={{ marginBottom: '4px' }}>{`> ${log}`}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fff3e0',
                    border: '1px solid #ffe0b2',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'start'
                }}>
                    <AlertTriangle size={24} color="#f57c00" style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#e65100' }}>Importante</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#e65100' }}>
                            Asegúrate de haber configurado tus credenciales en <code>src/firebase/config.js</code> antes de iniciar la carga.
                            Si no lo has hecho, la conexión fallará.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
