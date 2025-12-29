import { useEffect, useState } from 'react';

const ProgressBar = ({ active = false, duration = 3000, onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!active) {
            setProgress(0);
            return;
        }

        let startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [active, duration, onComplete]);

    if (!active && progress === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)',
                transition: 'width 0.1s linear',
                animation: progress < 100 ? 'shimmer 1.5s infinite' : 'none'
            }}></div>
        </div>
    );
};

export default ProgressBar;
