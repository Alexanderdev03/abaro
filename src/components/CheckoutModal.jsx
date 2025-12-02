import React, { useState } from 'react';
import { X, CreditCard, Banknote, MapPin, Clock } from 'lucide-react';

export function CheckoutModal({ onClose, onConfirm, total, initialCoupon, ...props }) {
    const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery', 'pickup'
    const [isProcessing, setIsProcessing] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState(initialCoupon ? initialCoupon.code : '');
    const [appliedCoupon, setAppliedCoupon] = useState(initialCoupon || null);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = () => {
        setCouponError('');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userCoupons = user.coupons || [];
        const adminCoupons = JSON.parse(localStorage.getItem('adminCoupons') || '[]');

        // Check user coupons first
        let validCoupon = userCoupons.find(c => c.code === couponCode);

        // If not found, check global admin coupons
        if (!validCoupon) {
            validCoupon = adminCoupons.find(c => c.code === couponCode);
        }

        if (validCoupon) {
            setAppliedCoupon(validCoupon);
            setCouponCode('');
        } else {
            setCouponError('Cupón inválido o no encontrado');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsProcessing(true);
        // setTimeout(() => {
        onConfirm({
            receiverName: 'Cliente', // Default name since input is removed
            deliveryMethod,
            address: deliveryMethod === 'delivery' ? 'A coordinar por WhatsApp' : 'Recoger en Tienda',
            paymentMethod: 'A coordinar', // Default payment method
            deliverySchedule: 'asap', // Default
            coupon: appliedCoupon // Pass the applied coupon
        });
        setIsProcessing(false);
        // }, 1500);
    };

    // Calculate totals
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const shippingCost = deliveryMethod === 'delivery' ? (props.deliveryCost || 0) : 0;
    const finalPayable = Math.max(0, total + shippingCost - couponDiscount);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                width: '100%',
                maxWidth: '400px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} color="#666" />
                </button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Finalizar Compra</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                            Método de Entrega
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setDeliveryMethod('delivery')}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: `2px solid ${deliveryMethod === 'delivery' ? 'var(--color-primary)' : '#eee'}`,
                                    backgroundColor: deliveryMethod === 'delivery' ? '#e8f5e9' : 'white',
                                    color: deliveryMethod === 'delivery' ? 'var(--color-primary)' : '#666',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                🚚 Envío a Domicilio
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeliveryMethod('pickup')}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: `2px solid ${deliveryMethod === 'pickup' ? 'var(--color-primary)' : '#eee'}`,
                                    backgroundColor: deliveryMethod === 'pickup' ? '#e8f5e9' : 'white',
                                    color: deliveryMethod === 'pickup' ? 'var(--color-primary)' : '#666',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                🏪 Recoger en Tienda
                            </button>
                        </div>
                    </div>

                    {/* Coupon Summary (Read Only) */}
                    {appliedCoupon && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="flex-between" style={{
                                padding: '0.75rem',
                                backgroundColor: '#e8f5e9',
                                borderRadius: '8px',
                                color: '#2e7d32',
                                fontSize: '0.9rem',
                                border: '1px solid #c8e6c9'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>🏷️</span>
                                    <span>Cupón aplicado: <strong>{appliedCoupon.code}</strong></span>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>-${appliedCoupon.discount.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex-between" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                        <span>Total a Pagar</span>
                        <span style={{ color: 'var(--color-primary)' }}>${finalPayable.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-add"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            opacity: isProcessing ? 0.7 : 1,
                            cursor: isProcessing ? 'wait' : 'pointer'
                        }}
                    >
                        {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                </form>
            </div>
        </div>
    );
}
