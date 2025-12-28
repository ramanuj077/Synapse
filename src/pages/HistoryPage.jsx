import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FadeIn, ScaleIn } from '../components/Animations';
import useAuthStore from '../store/authStore';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore(); // Get token from store

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const config = {};
                if (token) {
                    config.headers = { Authorization: `Bearer ${token}` };
                }
                const res = await axios.get('http://localhost:5000/api/history', config);
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    return (
        <FadeIn className="container h-full flex flex-col gap-8">
            <div>
                <h2>Transformation History</h2>
                <p style={{ color: 'var(--text-muted)' }}>Recent optimization logs from the AI Core.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="spinner" style={{ fontSize: '2rem' }}>⚡</span>
                </div>
            ) : history.length === 0 ? (
                <div className="card text-center p-8">
                    <p style={{ color: 'var(--text-muted)' }}>No history found. Start refactoring!</p>
                </div>
            ) : (
                <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {history.map((item, index) => (
                        <ScaleIn key={item.id} delay={index * 0.05}>
                            <div className="card h-full" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="flex justify-between items-start">
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background: 'var(--bg-card-hover)',
                                        color: 'var(--text-muted)'
                                    }}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                    {item.smell && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#FCA5A5',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}>
                                            {item.smell}
                                        </span>
                                    )}
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    background: 'rgba(0,0,0,0.2)',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {item.snippet}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 'auto', paddingTop: '0.5rem' }}>
                                    {item.explanation}
                                </div>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            )}
        </FadeIn>
    );
};

export default HistoryPage;
