import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

const FeedbackButtons = ({ resultId, onFeedback }) => {
    const [feedback, setFeedback] = useState(null);
    const [saved, setSaved] = useState(false);

    const handleFeedback = async (type) => {
        setFeedback(type);
        setSaved(false);

        // Simulate save (you can connect to backend later)
        setTimeout(() => {
            setSaved(true);
            if (onFeedback) onFeedback(type);
        }, 500);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid var(--border)'
        }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1 }}>
                Was this refactoring helpful?
            </span>

            <button
                onClick={() => handleFeedback('helpful')}
                disabled={feedback !== null}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: feedback === 'helpful' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    border: `1px solid ${feedback === 'helpful' ? '#10b981' : 'var(--border)'}`,
                    borderRadius: '8px',
                    color: feedback === 'helpful' ? '#10b981' : 'var(--text-main)',
                    cursor: feedback ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.85rem',
                    fontWeight: 500
                }}
            >
                <ThumbsUp size={16} />
                Helpful
            </button>

            <button
                onClick={() => handleFeedback('not_helpful')}
                disabled={feedback !== null}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: feedback === 'not_helpful' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                    border: `1px solid ${feedback === 'not_helpful' ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: '8px',
                    color: feedback === 'not_helpful' ? '#ef4444' : 'var(--text-main)',
                    cursor: feedback ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.85rem',
                    fontWeight: 500
                }}
            >
                <ThumbsDown size={16} />
                Not Helpful
            </button>

            {saved && (
                <span style={{
                    fontSize: '0.75rem',
                    color: '#10b981',
                    animation: 'fade-in 0.3s'
                }}>
                    ✓ Saved
                </span>
            )}
        </div>
    );
};

export default FeedbackButtons;
