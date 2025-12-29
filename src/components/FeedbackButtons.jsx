import { ThumbsUp, ThumbsDown, MessageSquare, Check, X } from 'lucide-react';
import { useState } from 'react';

const FeedbackButtons = ({ resultId, onFeedback }) => {
    const [feedback, setFeedback] = useState(null);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [saved, setSaved] = useState(false);

    const handleFeedback = async (type) => {
        setFeedback(type);
        setSaved(false);

        // Simulate save (you can connect to backend later)
        setTimeout(() => {
            setSaved(true);
            if (onFeedback) onFeedback({ type, comment });
        }, 500);
    };

    const handleAccept = () => {
        handleFeedback('accepted');
    };

    const handleReject = () => {
        handleFeedback('rejected');
        setShowComment(true);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(16, 185, 129, 0.03))',
            borderRadius: '12px',
            border: '1px solid var(--border)'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        Review Analysis Results
                    </span>
                </div>
                {saved && (
                    <span style={{
                        fontSize: '0.75rem',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 500
                    }}>
                        <Check size={14} /> Feedback Saved
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={handleAccept}
                    disabled={feedback !== null}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: feedback === 'accepted'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'rgba(16, 185, 129, 0.1)',
                        border: `1px solid ${feedback === 'accepted' ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
                        borderRadius: '10px',
                        color: feedback === 'accepted' ? 'white' : '#10b981',
                        cursor: feedback ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        opacity: feedback && feedback !== 'accepted' ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!feedback) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <ThumbsUp size={16} />
                    Accept Changes
                </button>

                <button
                    onClick={handleReject}
                    disabled={feedback !== null}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: feedback === 'rejected'
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${feedback === 'rejected' ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: '10px',
                        color: feedback === 'rejected' ? 'white' : '#ef4444',
                        cursor: feedback ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        opacity: feedback && feedback !== 'rejected' ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!feedback) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <ThumbsDown size={16} />
                    Reject Changes
                </button>
            </div>

            {/* Comment Box */}
            {(showComment || feedback === 'rejected') && (
                <div style={{
                    animation: 'slideDown 0.3s ease-out',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Why did you reject? (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="e.g., The changes broke functionality, or the code is less readable..."
                        disabled={saved}
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '0.75rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-main)',
                            fontSize: '0.85rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                </div>
            )}
        </div>
    );
};

export default FeedbackButtons;
