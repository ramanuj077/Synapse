import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

const Tooltip = ({ content, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    animation: 'fadeIn 0.2s ease-out',
                    pointerEvents: 'none'
                }}>
                    {content}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgba(0, 0, 0, 0.9)'
                    }}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
