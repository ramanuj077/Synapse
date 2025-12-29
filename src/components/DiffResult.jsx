import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Code2, SplitSquareHorizontal, AlignJustify } from 'lucide-react';

const DiffResult = ({ original, modified, language = 'javascript' }) => {
    const [viewMode, setViewMode] = useState('split'); // 'split' or 'inline'

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        }}>
            {/* Header with View Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={18} color="#818cf8" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Code Comparison
                    </span>
                    <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                    }}>
                        {language.toUpperCase()}
                    </span>
                </div>

                {/* View Mode Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'var(--bg-card)',
                    padding: '0.25rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)'
                }}>
                    <button
                        onClick={() => setViewMode('split')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.75rem',
                            background: viewMode === 'split' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            color: viewMode === 'split' ? '#818cf8' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <SplitSquareHorizontal size={14} />
                        Split View
                    </button>
                    <button
                        onClick={() => setViewMode('inline')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.75rem',
                            background: viewMode === 'inline' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            color: viewMode === 'inline' ? '#818cf8' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <AlignJustify size={14} />
                        Inline View
                    </button>
                </div>
            </div>

            {/* Diff Editor */}
            <div style={{
                height: '500px',
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
                <DiffEditor
                    height="100%"
                    original={original}
                    modified={modified}
                    language={language}
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: 'JetBrains Mono, Consolas, monospace',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        renderSideBySide: viewMode === 'split',
                        lineNumbers: 'on',
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: 'all',
                        scrollbar: {
                            vertical: 'visible',
                            horizontal: 'visible',
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10
                        },
                        diffWordWrap: 'on'
                    }}
                />
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        background: '#f87171',
                        borderRadius: '2px'
                    }}></div>
                    <span>Removed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        background: '#34d399',
                        borderRadius: '2px'
                    }}></div>
                    <span>Added</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        background: '#fbbf24',
                        borderRadius: '2px'
                    }}></div>
                    <span>Modified</span>
                </div>
            </div>
        </div>
    );
};

export default DiffResult;
