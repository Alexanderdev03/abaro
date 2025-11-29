import React, { useState, useEffect, useRef } from 'react';
import { Trophy, X, Sparkles } from 'lucide-react';

export function ScratchGame({ onWin, onClose }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [prize, setPrize] = useState(0);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        // Determine prize
        const prizes = [5, 10, 15, 20, 50];
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        setPrize(randomPrize);

        // Setup Canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#C0C0C0'; // Silver scratch color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add "Scratch Here" text
            ctx.fillStyle = '#666';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('¡Rasca aquí!', canvas.width / 2, canvas.height / 2);
        }
    }, []);

    const handleScratch = (e) => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Check how much is scratched
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        if (transparentPixels > (pixels.length / 4) * 0.5) { // 50% scratched
            setIsRevealed(true);
            onWin(prize);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '2rem',
                width: '100%',
                maxWidth: '350px',
                textAlign: 'center',
                position: 'relative',
                animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} color="#666" />
                </button>

                <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>¡Rasca y Gana! 🎰</h2>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>Descubre tu premio diario</p>

                <div style={{
                    position: 'relative',
                    width: '250px',
                    height: '150px',
                    margin: '0 auto',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {/* Prize Background */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff3e0',
                        color: '#e65100'
                    }}>
                        <Trophy size={40} color="#ff9800" style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>+{prize} pts</span>
                    </div>

                    {/* Scratch Canvas */}
                    <canvas
                        ref={canvasRef}
                        width={250}
                        height={150}
                        onMouseDown={() => setIsDrawing(true)}
                        onMouseUp={() => setIsDrawing(false)}
                        onMouseMove={(e) => isDrawing && handleScratch(e)}
                        onTouchStart={() => setIsDrawing(true)}
                        onTouchEnd={() => setIsDrawing(false)}
                        onTouchMove={(e) => isDrawing && handleScratch(e)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            cursor: 'pointer',
                            opacity: isRevealed ? 0 : 1,
                            transition: 'opacity 0.5s ease',
                            pointerEvents: isRevealed ? 'none' : 'auto'
                        }}
                    />
                </div>

                {isRevealed && (
                    <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s' }}>
                        <p style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '1rem' }}>
                            <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            ¡Felicidades! Ganaste {prize} puntos
                        </p>
                        <button
                            onClick={onClose}
                            className="btn btn-primary"
                        >
                            Cobrar Premio
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
