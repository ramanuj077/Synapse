import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import DiffResult from './DiffResult';
import { ScaleIn } from './Animations';
import CodeHealthScore from './CodeHealthScore';
import FeedbackButtons from './FeedbackButtons';

const MetricsCard = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <ScaleIn delay={0.2} className="card" style={{ marginBottom: '1rem', background: 'var(--bg-card-hover)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Complexity</span>
                    <div className="flex items-center justify-center gap-2">
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#F87171' }}>{metrics.complexity_before}</span>
                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#34D399' }}>{metrics.complexity_after}</span>
                    </div>
                </div>

                {/* NEW: Time Complexity & Risk */}
                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Impact</span>
                    <div className="flex items-center justify-center gap-2">
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{metrics.time_complexity_before || '?'}</span>
                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent)' }}>{metrics.time_complexity_after || '?'}</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Score</span>
                    <div className="flex items-center justify-center gap-1">
                        <span style={{ fontSize: '1.5rem', fontWeight: 600, color: metrics.risk_score < 20 ? '#34D399' : '#F87171' }}>
                            {metrics.risk_score}%
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>prob.</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Code Saved</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>
                        {metrics.lines_saved} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>lines</span>
                    </span>
                </div>
            </div>
        </ScaleIn>
    )
}

const RefactorResult = ({ data, onApply }) => {
    const [viewMode, setViewMode] = useState('code'); // 'code' | 'diff'

    if (!data) return (
        <div className="card h-full flex items-center justify-center p-8 text-center">
            <div>
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    opacity: 0.5,
                    filter: 'drop-shadow(0 0 10px var(--primary-glow))'
                }}>✨</div>
                <h3 style={{ color: 'var(--text-muted)' }}>Ready to Optimize</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Paste your code on the left and hit Refactor.<br />
                    Synapse will analyze and improve it.
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 h-full" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 140px)', paddingRight: '4px' }}>


            {/* Enhanced Code Smell Alert - Demo Ready */}
            {data.smell_detected && (
                <div className="animate-fade-in" style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.05))',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            fontSize: '2.5rem',
                            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))'
                        }}>🚨</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <h3 style={{
                                    color: '#fca5a5',
                                    fontSize: '1.1rem',
                                    margin: 0,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Code Smell Detected</h3>
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#fca5a5',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>High Priority</div>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: '1rem',
                                color: '#fef2f2',
                                fontWeight: 500,
                                lineHeight: '1.6'
                            }}>{data.smell_detected}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Safety Gate Warning (Synapse 2.1) */}
            {data.safety_status === 'syntax_warning' && (
                <div className="animate-fade-in" style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'start'
                }}>
                    <div style={{ color: '#F59E0B' }}>🛡️</div>
                    <div>
                        <h4 style={{ color: '#F59E0B', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Synapse 3.0 Warning</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#FCD34D' }}>
                            Self-healing failed after multiple attempts. The code may contain syntax errors.
                        </p>
                    </div>
                </div>
            )}

            {/* Self-Healing Success Badge (Synapse 3.0) */}
            {data.metrics?.healing_attempts > 0 && data.safety_status !== 'syntax_warning' && (
                <div className="animate-fade-in" style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '0.8rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginBottom: '1rem'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🚑</span>
                    <div>
                        <h4 style={{ color: 'var(--secondary)', fontSize: '0.85rem', margin: 0 }}>Self-Healed Code</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Synapse detected and fixed a syntax error automatically during generation.
                        </p>
                    </div>
                </div>
            )}

            {/* NEW: Engineering Metrics HUD */}
            <MetricsCard metrics={data.metrics} />

            {/* Enhanced Explanation - Judge Ready */}
            <div className="card animate-slide-up" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                padding: '1.5rem',
                borderRadius: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '1.25rem' }}>💡</span>
                    </div>
                    <h4 style={{
                        color: '#a5b4fc',
                        margin: 0,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: 700
                    }}>AI Insight & Analysis</h4>
                </div>
                <p style={{
                    margin: 0,
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.8',
                    fontWeight: 400
                }}>
                    {data.explanation}
                </p>
            </div>

            {/* Refactored Code */}
            <div className="card flex-1 flex flex-col animate-slide-up" style={{ padding: 0, overflow: 'hidden', minHeight: '400px', animationDelay: '0.1s' }}>
                <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-card-hover)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode('code')}
                            style={{
                                background: viewMode === 'code' ? 'rgba(99, 102, 241, 0.15)' : 'none',
                                border: 'none',
                                color: viewMode === 'code' ? '#a5b4fc' : 'var(--text-muted)',
                                fontWeight: viewMode === 'code' ? 700 : 400,
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <span>✨</span> Final Result
                        </button>
                        <button
                            onClick={() => setViewMode('diff')}
                            style={{
                                background: viewMode === 'diff' ? 'rgba(16, 185, 129, 0.15)' : 'none',
                                border: 'none',
                                color: viewMode === 'diff' ? '#6ee7b7' : 'var(--text-muted)',
                                fontWeight: viewMode === 'diff' ? 700 : 400,
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <span>🔄</span> Before/After Diff
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                navigator.clipboard.writeText(data.refactored_code);
                                // Optional: Add toast notification
                            }}
                            style={{
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>📋</span> Copy Code
                        </button>
                        <button
                            className="btn"
                            onClick={() => onApply && onApply(data.refactored_code)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                fontSize: '0.85rem',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <span>✅</span> Apply Fix
                        </button>
                    </div>
                </div>

                <div style={{
                    margin: 0,
                    padding: '0',
                    background: '#0B0C12',
                    overflow: 'hidden',
                    flex: 1,
                    height: '100%'
                }}>
                    {viewMode === 'code' ? (
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            value={data.refactored_code}
                            theme="vs-dark"
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, monospace',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16 }
                            }}
                        />
                    ) : (
                        <DiffResult original={data.original_code} modified={data.refactored_code} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RefactorResult;
