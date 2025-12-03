import React, { useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

export function VoiceSearch({ onSearch, onStateChange }) {
    const { isListening, transcript, error, startListening, stopListening, isSupported } = useVoiceSearch();

    const [lastEmitted, setLastEmitted] = React.useState('');

    useEffect(() => {
        if (transcript && transcript !== lastEmitted) {
            onSearch(transcript);
            setLastEmitted(transcript);
        }
    }, [transcript, onSearch, lastEmitted]);

    useEffect(() => {
        if (onStateChange) {
            onStateChange(isListening);
        }
    }, [isListening, onStateChange]);

    if (!isSupported) return null;

    return (
        <button
            onClick={isListening ? stopListening : startListening}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isListening ? '#ef4444' : '#6b7280',
                position: 'relative',
                transition: 'all 0.2s ease'
            }}
            title={isListening ? "Detener escucha" : "Buscar por voz"}
        >
            {isListening ? (
                <>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        animation: 'pulse 1.5s infinite'
                    }} />
                    <Mic size={20} />
                </>
            ) : (
                <Mic size={20} />
            )}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.2; }
                    100% { transform: scale(0.8); opacity: 0.5; }
                }
            `}</style>
        </button>
    );
}
