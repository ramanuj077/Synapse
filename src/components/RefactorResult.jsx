import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import DiffResult from './DiffResult';
import { ScaleIn } from './Animations';
import CodeHealthScore from './CodeHealthScore';
import FeedbackButtons from './FeedbackButtons';
import SafetyBadges from './SafetyBadges';
import Tooltip from './Tooltip';
import { TrendingDown, TrendingUp, Clock, Shield, Minimize2, HelpCircle } from 'lucide-react';

const MetricsCard = ({ metrics }) => {
    if (!metrics) return null;

    const metricItems = [
        {
            icon: TrendingUp,
            label: 'Code Quality',
            tooltip: 'Measures code structure and complexity - lower is better',
            before: metrics.complexity_before,
            after: metrics.complexity_after,
            beforeColor: '#F87171',
            afterColor: '#34D399',
            improved: metrics.complexity_after < metrics.complexity_before
        },
        {
            icon: Clock,
            label: 'Time Impact',
            tooltip: 'Algorithm efficiency and execution speed improvements',
            before: metrics.time_complexity_before || '?',
            after: metrics.time_complexity_after || '?',
            beforeColor: 'var(--text-muted)',
            afterColor: 'var(--accent)',
            showArrow: true
        },
        {
            icon: Shield,
            label: 'Stability Score',
            tooltip: 'Probability of production issues - higher is better',
            value: `${metrics.risk_score}%`,
            valueColor: metrics.risk_score < 20 ? '#34D399' : '#F87171',
            subtitle: metrics.risk_score < 20 ? 'Low Risk' : 'Monitor',
            isStability: true
        },
        {
            icon: Minimize2,
            label: 'Lines Optimized',
            tooltip: 'Number of code lines reduced while preserving functionality',
            value: metrics.lines_saved,
            valueColor: 'var(--accent)',
            subtitle: 'lines',
            isOptimized: true
        }
    ];

    return (
        <ScaleIn delay={0.2} className="card" style={{
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '1.5rem'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem'
            }}>
                {metricItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        {/* Header with Icon and Tooltip */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    padding: '0.4rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <item.icon size={16} color="#818cf8" />
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.label}
                                </span>
                            </div>
                            <Tooltip content={item.tooltip}>
                                <HelpCircle
                                    size={14}
                                    color="var(--text-muted)"
                                    style={{ cursor: 'help', opacity: 0.6 }}
                                />
                            </Tooltip>
                        </div>

                        {/* Value Display */}
                        {item.isStability || item.isOptimized ? (
                            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: item.valueColor,
                                    lineHeight: 1,
                                    marginBottom: '0.25rem'
                                }}>
                                    {item.value}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase'
                                }}>
                                    {item.subtitle}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                padding: '0.5rem 0'
                            }}>
                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                    color: item.beforeColor
                                }}>
                                    {item.before}
                                </span>
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '1.2rem'
                                }}>
                                    →
                                </span>
                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                    color: item.afterColor
                                }}>
                                    {item.after}
                                </span>
                            </div>
                        )}

                        {/* Improvement Indicator */}
                        {item.improved && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.25rem',
                                fontSize: '0.7rem',
                                color: '#34D399',
                                fontWeight: 600
                            }}>
                                <TrendingDown size={12} />
                                <span>Improved</span>
                            </div>
                        )}
                    </div>
                ))}
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
                <h3 style={{ color: 'var(--text-muted)' }}>Ready to Analyze</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Paste your code on the left and start the analysis.<br />
                    We'll identify improvements and show you the results.
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
                                }}>Quality Issues Found</h3>
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

            {/* Safety Status Badges */}
            <SafetyBadges data={data} />

            {/* Feedback Section */}
            <FeedbackButtons
                resultId={data.id || 'result-' + Date.now()}
                onFeedback={(feedback) => console.log('Feedback:', feedback)}
            />

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
                        <h4 style={{ color: '#F59E0B', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Analysis Warning</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#FCD34D' }}>
                            Unable to fully optimize this code. Please verify syntax and structure.
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
                        <h4 style={{ color: 'var(--secondary)', fontSize: '0.85rem', margin: 0 }}>Auto-Corrected</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Detected and fixed syntax errors automatically during analysis.
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
                    }}>Analysis Summary</h4>
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
