import React, { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import DiffResult from './DiffResult';
import { ScaleIn } from './Animations';

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
                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600, color: metrics.maintainability_rating === 'A' ? '#34D399' : '#FBBF24' }}>
                        {metrics.maintainability_rating}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lines Saved</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>
                        {metrics.lines_saved}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                        🚀
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

    const highlightedCode = (() => {
        try {
            return Prism.highlight(data.refactored_code || '', Prism.languages.javascript, 'javascript');
        } catch (e) {
            return data.refactored_code;
        }
    })();

    return (
        <div className="flex flex-col gap-4 h-full" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 140px)', paddingRight: '4px' }}>

            {/* Code Smell Alert */}
            {data.smell_detected && (
                <div className="animate-fade-in" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'start'
                }}>
                    <div style={{ color: 'var(--error)' }}>⚠️</div>
                    <div>
                        <h4 style={{ color: 'var(--error)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Detected Anti-Pattern</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#FECACA' }}>{data.smell_detected}</p>
                    </div>
                </div>
            )}

            {/* NEW: Engineering Metrics HUD */}
            <MetricsCard metrics={data.metrics} />

            {/* Explanation */}
            <div className="card animate-slide-up">
                <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Insight</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {data.explanation}
                </p>
            </div>

            {/* Refactored Code */}
            <div className="card flex-1 flex flex-col animate-slide-up" style={{ padding: 0, overflow: 'hidden', minHeight: '300px', animationDelay: '0.1s' }}>
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
                                background: 'none',
                                border: 'none',
                                color: viewMode === 'code' ? 'var(--accent)' : 'var(--text-muted)',
                                fontWeight: viewMode === 'code' ? 600 : 400,
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Result
                        </button>
                        <button
                            onClick={() => setViewMode('diff')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: viewMode === 'diff' ? 'var(--accent)' : 'var(--text-muted)',
                                fontWeight: viewMode === 'diff' ? 600 : 400,
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Diff
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn-secondary"
                            onClick={() => navigator.clipboard.writeText(data.refactored_code)}
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                        >
                            Copy
                        </button>
                        <button
                            className="btn"
                            onClick={() => onApply && onApply(data.refactored_code)}
                            style={{
                                padding: '0.2rem 0.8rem',
                                fontSize: '0.75rem',
                                background: 'var(--accent)',
                                boxShadow: '0 2px 10px var(--accent-glow)'
                            }}
                        >
                            Apply Fix
                        </button>
                    </div>
                </div>

                <div style={{
                    margin: 0,
                    padding: '1rem',
                    background: '#0B0C12',
                    color: '#f8f8f2',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    overflow: 'auto',
                    flex: 1
                }}>
                    {viewMode === 'code' ? (
                        <pre
                            style={{ margin: 0, fontFamily: 'inherit' }}
                            dangerouslySetInnerHTML={{ __html: highlightedCode }}
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
