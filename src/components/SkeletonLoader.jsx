import './skeleton.css';

const SkeletonLoader = ({ type = 'card' }) => {
    if (type === 'metrics') {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px'
            }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '10px',
                        border: '1px solid var(--border)'
                    }}>
                        <div className="skeleton skeleton-text" style={{ width: '60%', height: '12px', marginBottom: '1rem' }}></div>
                        <div className="skeleton skeleton-circle" style={{ width: '60px', height: '60px', margin: '1rem auto' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '40%', height: '10px', margin: '0 auto' }}></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'code') {
        return (
            <div style={{
                padding: '1.5rem',
                background: '#0B0C12',
                borderRadius: '12px',
                border: '1px solid var(--border)'
            }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="skeleton skeleton-text" style={{
                        width: `${60 + Math.random() * 30}%`,
                        height: '16px',
                        marginBottom: '0.75rem'
                    }}></div>
                ))}
            </div>
        );
    }

    return (
        <div className="skeleton skeleton-card" style={{
            width: '100%',
            height: '200px',
            borderRadius: '12px'
        }}></div>
    );
};

export default SkeletonLoader;
