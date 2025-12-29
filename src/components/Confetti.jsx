import { useEffect, useState } from 'react';
import './confetti.css';

const Confetti = ({ active = false, duration = 3000 }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (!active) {
            setParticles([]);
            return;
        }

        // Generate confetti particles
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 200,
            duration: 2000 + Math.random() * 1000,
            color: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 6)],
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5
        }));

        setParticles(newParticles);

        // Clear after duration
        const timeout = setTimeout(() => {
            setParticles([]);
        }, duration);

        return () => clearTimeout(timeout);
    }, [active, duration]);

    if (particles.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="confetti-particle"
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: `${particle.left}%`,
                        width: '10px',
                        height: '10px',
                        background: particle.color,
                        animation: `confetti-fall ${particle.duration}ms ease-out ${particle.delay}ms forwards`,
                        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
                        borderRadius: '2px'
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
