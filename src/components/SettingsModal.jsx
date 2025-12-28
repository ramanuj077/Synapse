import { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, preferences, onSave }) => {
    // Hooks must be unconditional
    const [localPrefs, setLocalPrefs] = useState(preferences);

    useEffect(() => {
        setLocalPrefs(preferences);
    }, [preferences]);

    if (!isOpen) return null;

    const handleChange = (key, value) => {
        setLocalPrefs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div className="card" style={{ width: '500px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3>Personalization Settings</h3>
                    <button className="btn-secondary" onClick={onClose} style={{ padding: '0.2rem 0.6rem' }}>✕</button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Custom Style Guidelines</span>
                        <textarea
                            value={localPrefs.customInstructions}
                            onChange={(e) => handleChange('customInstructions', e.target.value)}
                            className="card"
                            placeholder="e.g. Use 'const' over 'let', 2 space indentation..."
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-main)',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4" style={{ marginTop: '2rem' }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn" onClick={() => { onSave(localPrefs); onClose(); }}>Save Preferences</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
