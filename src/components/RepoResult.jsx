import React from 'react';
import { FileCode, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const RepoResult = ({ data, onSelectFile }) => {
    if (!data) return null;

    const { repo, files_analyzed, total_smells, results } = data;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', overflowY: 'auto' }}>
            {/* Header Summary */}
            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ opacity: 0.7 }}>Repository:</span> {repo}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#818cf8' }}>{files_analyzed}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Files Analyzed</div>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{total_smells}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Smells Detected</div>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{files_analyzed - (total_smells > 0 ? 1 : 0) /* simplistic */} </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clean Files</div>
                    </div>
                </div>
            </div>

            {/* File List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>File Analysis Details</h4>
                {results.map((file, idx) => (
                    <div key={idx} style={{
                        background: 'var(--bg-panel)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '1rem',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    }} className="h-hover" onClick={() => onSelectFile(file)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <FileCode size={16} className="text-muted" />
                                {file.path}
                            </div>
                            {file.error ? (
                                <span style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> Failed</span>
                            ) : file.analysis?.smell_detected ? (
                                <span style={{ color: '#f59e0b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> Issues Found</span>
                            ) : (
                                <span style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Clean</span>
                            )}
                        </div>

                        {file.analysis && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                {file.analysis.smell_detected && (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#f59e0b' }}>Detected:</strong> {file.analysis.smell_detected}
                                    </div>
                                )}
                                <div style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace',
                                    borderLeft: '2px solid var(--primary)'
                                }}>
                                    {file.analysis.explanation}
                                </div>
                            </div>
                        )}

                        {/* View Refactored Code Button */}
                        {file.analysis && (
                            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onSelectFile(file); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    View Refactored Code <ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RepoResult;
