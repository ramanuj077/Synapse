import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';

const CopyButton = ({ code, fileName = 'code' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <>
            <button
                onClick={handleCopy}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${copied ? '#10b981' : 'var(--border)'}`,
                    borderRadius: '8px',
                    color: copied ? '#10b981' : 'var(--text-main)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (!copied) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.borderColor = 'var(--primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!copied) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.borderColor = 'var(--border)';
                    }
                }}
            >
                {copied ? (
                    <>
                        <Check size={16} />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy size={16} />
                        Copy Code
                    </>
                )}
            </button>

            {/* Toast Notification */}
            {copied && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'slideInRight 0.3s ease-out',
                    zIndex: 10000,
                    fontWeight: 600
                }}>
                    <Check size={20} />
                    <span>Code copied to clipboard!</span>
                </div>
            )}
        </>
    );
};

export default CopyButton;
