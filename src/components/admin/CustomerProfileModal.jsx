import React from 'react';
import { X, User, ShoppingBag, Calendar, DollarSign, Award, Package } from 'lucide-react';

export function CustomerProfileModal({ customer, onClose, orderHistory = [] }) {
    if (!customer) return null;

    // Calculate metrics
    const totalSpent = orderHistory.reduce((sum, order) => sum + (order.total || 0), 0);
    const lastOrderDate = orderHistory.length > 0
        ? new Date(Math.max(...orderHistory.map(o => new Date(o.date).getTime()))).toLocaleDateString()
        : 'Sin compras';

    // Find favorite product
    const productCounts = {};
    orderHistory.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                productCounts[item.name] = (productCounts[item.name] || 0) + (item.quantity || 1);
            });
        }
    });
    const favoriteProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ padding: '2rem' }}>
                    {/* Header Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundColor: '#e0f2fe', color: '#0284c7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 'bold'
                        }}>
                            {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>{customer.name || 'Usuario'}</h2>
                            <div style={{ color: '#6b7280', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <span>{customer.email}</span>
                                {customer.phone && <span>• {customer.phone}</span>}
                            </div>
                            <div style={{ marginTop: '0.5rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem', backgroundColor: '#dcfce7', color: '#15803d',
                                    borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600'
                                }}>
                                    Cliente Activo
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                <DollarSign size={18} />
                                <span style={{ fontSize: '0.875rem' }}>Total Gastado (LTV)</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                                ${totalSpent.toFixed(2)}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                <ShoppingBag size={18} />
                                <span style={{ fontSize: '0.875rem' }}>Total Pedidos</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                                {orderHistory.length}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                <Calendar size={18} />
                                <span style={{ fontSize: '0.875rem' }}>Última Compra</span>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                                {lastOrderDate}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9a3412', marginBottom: '0.5rem' }}>
                                <Award size={18} />
                                <span style={{ fontSize: '0.875rem' }}>Producto Favorito</span>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#9a3412', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {favoriteProduct ? favoriteProduct[0] : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <h3 style={{ fontSize: '1.1rem', color: '#111827', marginBottom: '1rem' }}>Historial de Pedidos</h3>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>ID Pedido</th>
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>Fecha</th>
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>Items</th>
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>Total</th>
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            No hay pedidos registrados
                                        </td>
                                    </tr>
                                ) : (
                                    orderHistory.map((order, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#111827' }}>
                                                #{order.id ? order.id.slice(-6) : idx + 1}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                {order.items ? order.items.length : 0} items
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                                ${order.total.toFixed(2)}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span style={{
                                                    padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem',
                                                    backgroundColor: order.status === 'completed' ? '#dcfce7' : '#fef3c7',
                                                    color: order.status === 'completed' ? '#15803d' : '#92400e'
                                                }}>
                                                    {order.status === 'completed' ? 'Completado' : 'Pendiente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
