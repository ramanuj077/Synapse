import React, { useState } from 'react';
import axios from 'axios';
const API_URL = 'https://synapse-ns5r.onrender.com';
import CodeEditor from '../components/CodeEditor';
import RefactorResult from '../components/RefactorResult';
import RepoResult from '../components/RepoResult';
import { FadeIn } from '../components/Animations';
import useAuthStore from '../store/authStore';
import {
    Play,
    Sparkles,
    Clipboard,
    FileCode,
    CheckCircle2,
    Github,
    ArrowRight,
    ArrowLeft,
    Scan,
    Wand2,
    ShieldCheck
} from 'lucide-react';

const RefactorPage = ({ preferences }) => {
    const { token } = useAuthStore();
    const [inputCode, setInputCode] = useState(`// 🚀 Synapse 2.1
// Paste code or a GitHub File URL below...
// To analyze an entire Repo, paste the root URL (e.g. https://github.com/owner/repo)

function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [refactorType, setRefactorType] = useState('clean-code');
    const [language, setLanguage] = useState('auto'); // auto-detect by default
    const [isRepoMode, setIsRepoMode] = useState(false);

    // New State for Deep Inspection
    const [selectedFileResult, setSelectedFileResult] = useState(null);

    const handleRefactor = async () => {
        if (!inputCode || !inputCode.trim()) {
            alert('Please enter some code to analyze.');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setIsRepoMode(false);
        setSelectedFileResult(null); // Clear selection

        // Detect Repo Mode or Single File Mode
        // We look for the first valid URL in the input, ignoring comments
        const lines = inputCode.split('\n');
        const urlLine = lines.find(line => line.trim().startsWith('http') && line.includes('github.com'));

        // If no URL found, treat as raw code
        const targetUrl = urlLine ? urlLine.trim() : null;
        const isRepoUrl = targetUrl && !targetUrl.includes('/blob/');
        const isFileUrl = targetUrl && targetUrl.includes('/blob/');

        // If it's a URL, we use that. If not, we send the whole inputCode as raw code.
        const payloadCode = (isRepoUrl || isFileUrl) ? targetUrl : inputCode;

        try {
            const config = {};
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }

            if (isRepoUrl) {
                // REPO ANALYSIS
                const response = await axios.post(`${API_URL}/api/repo/analyze`, {
                    repoUrl: targetUrl,
                    preferences
                }, config);
                setResult(response.data);
                setIsRepoMode(true);
            } else {
                // SINGLE FILE ANALYSIS (URL or Raw Code)
                const response = await axios.post(`${API_URL}/api/analyze`, {
                    code: payloadCode,
                    preferences,
                    refactorType,
                    language: language === 'auto' ? undefined : language
                }, config);
                setResult(response.data);
            }

        } catch (error) {
            console.error("Analysis Failed:", error);
            setResult({
                explanation: "Failed to connect to Synapse Core.",
                smell_detected: "Network Error",
                refactored_code: inputCode
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputCode(text);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    const loadSample = () => {
        setInputCode(`// 🧪 Sample: Complex React UseEffect
import { useEffect, useState } from 'react';

function UserData({ userId }) {
  const [data, setData] = useState(null);

  useEffect(async () => {
    const response = await fetch('/api/user/' + userId);
    const json = await response.json();
    setData(json);
  }, []); // Eslint warning: missing dependency

  return <div>{data ? data.name : 'Loading...'}</div>;
}`);
    };

    const loadGithubPlaceholder = () => {
        setInputCode(`// 🔗 GitHub Analysis
// Synapse analyzes what you paste.

// To analyze a Single File (Source code will be fetched):
// https://github.com/facebook/react/blob/main/packages/react/index.js

// To analyze an Entire Repo (Top 5 files analyzed):
// https://github.com/facebook/react`);
    };

    return (
        <FadeIn className="flex flex-col h-full gap-6">

            {/* 1. Top Section: Header & Visual Flow */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))'
                        }}>
                            Code Quality Assistant
                        </span>
                    </h2>

                    {/* Visual Flow Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.25rem', borderRadius: '4px' }}><FileCode size={12} /></div>
                            Paste Code
                        </div>
                        <ArrowRight size={12} style={{ opacity: 0.3 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.25rem', borderRadius: '4px' }}><Scan size={12} /></div>
                            Analyze Quality
                        </div>
                        <ArrowRight size={12} style={{ opacity: 0.3 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.25rem', borderRadius: '4px' }}><Wand2 size={12} /></div>
                            Apply Improvements
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Language Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Language
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                style={{
                                    background: '#18181b',
                                    color: '#fff',
                                    padding: '0.7rem 1rem 0.7rem 2.5rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    minWidth: '180px',
                                    outline: 'none',
                                    appearance: 'none'
                                }}
                            >
                                <option style={{ background: '#18181b', color: 'white' }} value="auto">🤖 Auto-Detect</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="javascript">📜 JavaScript</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="react">⚛️ React</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="python">🐍 Python</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="java">☕ Java</option>
                            </select>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <FileCode size={14} color="var(--primary)" />
                            </div>
                        </div>
                    </div>

                    {/* Optimization Mode Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Optimization Mode
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={refactorType}
                                onChange={(e) => setRefactorType(e.target.value)}
                                style={{
                                    background: '#18181b',
                                    color: '#fff',
                                    padding: '0.7rem 1rem 0.7rem 2.5rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    minWidth: '220px',
                                    outline: 'none',
                                    appearance: 'none'
                                }}
                            >
                                <option style={{ background: '#18181b', color: 'white' }} value="clean-code">✨ Clean Code (Maintainability)</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="performance">⚡ Performance (Speed)</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="readability">📖 Readability (Clarity)</option>
                                <option style={{ background: '#18181b', color: 'white' }} value="security">🛡️ Security (Safety)</option>
                            </select>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <Sparkles size={14} color="var(--primary)" />
                            </div>
                        </div>
                    </div>

                    {/* Run Button */}
                    <button
                        className="btn-glow"
                        onClick={handleRefactor}
                        disabled={isAnalyzing}
                        style={{
                            padding: '0.85rem 1.8rem',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            borderRadius: '12px',
                            height: 'fit-content',
                            alignSelf: 'flex-end'
                        }}
                    >
                        {isAnalyzing ? (
                            <>
                                <span className="spinner">⚡</span> Processing
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} fill="currentColor" /> Analyze Code Quality
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 2. Main Workspace Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 55%) minmax(0, 1fr)', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                {/* Left: Code Editor */}
                <div className="mac-window" style={{ display: 'flex', flexDirection: 'column', background: '#0d0d12' }}>
                    <div className="mac-header" style={{ justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="flex gap-2">
                                <div className="mac-dot red"></div>
                                <div className="mac-dot yellow"></div>
                                <div className="mac-dot green"></div>
                            </div>
                            <div className="mac-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileCode size={14} color="#6366f1" />
                                <span>source_code.js</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePaste}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#e2e8f0',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.75rem',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '6px',
                                transition: 'all 0.2s',
                                fontWeight: 500
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                            className="h-hover"
                        >
                            <Clipboard size={12} /> Paste Code
                        </button>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <CodeEditor code={inputCode} onChange={setInputCode} label="" />
                    </div>
                </div>

                {/* Right: Results Panel */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {result ? (
                        <div className="card-content" style={{ padding: 0 }}>
                            {selectedFileResult ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setSelectedFileResult(null)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                            className="h-hover"
                                        >
                                            <ArrowLeft size={16} /> Back to Repository Results
                                        </button>
                                        <div style={{ width: '1px', height: '16px', background: 'var(--border)' }}></div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedFileResult.path}</span>
                                    </div>
                                    <RefactorResult
                                        data={selectedFileResult.analysis}
                                        onApply={(newCode) => {
                                            setInputCode(newCode);
                                        }}
                                    />
                                </div>
                            ) : isRepoMode ? (
                                <RepoResult
                                    data={result}
                                    onSelectFile={(file) => setSelectedFileResult(file)}
                                />
                            ) : (
                                <RefactorResult
                                    data={result}
                                    onApply={(newCode) => {
                                        setInputCode(newCode);
                                        setResult(null);
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#0a0a0a',
                            padding: '2rem',
                            textAlign: 'center',
                            zIndex: 2,
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                            }}>
                                <Sparkles size={32} color="#818cf8" />
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                Get Started
                            </h3>
                            <p style={{ maxWidth: '300px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                Transform messy code into clean, maintainable code. <br />
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Supported: JS, TS, Python, Java</span>
                            </p>

                            {/* 3 Micro-Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '320px' }}>
                                <button
                                    onClick={loadSample}
                                    className="h-hover"
                                    style={{
                                        background: 'var(--bg-panel)',
                                        border: '1px solid var(--border)',
                                        padding: '0.8rem',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem', borderRadius: '6px' }}><div style={{ fontSize: '1rem' }}>🧪</div></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Try Sample Code</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Load a buggy React component</div>
                                    </div>
                                    <ArrowRight size={14} color="var(--text-muted)" />
                                </button>

                                <button
                                    onClick={loadGithubPlaceholder}
                                    className="h-hover"
                                    style={{
                                        background: 'var(--bg-panel)',
                                        border: '1px solid var(--border)',
                                        padding: '0.8rem',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem', borderRadius: '6px' }}><Github size={16} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analyze GitHub File</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fetch raw code from URL</div>
                                    </div>
                                    <ArrowRight size={14} color="var(--text-muted)" />
                                </button>

                                <button
                                    onClick={handlePaste}
                                    className="h-hover"
                                    style={{
                                        background: 'var(--bg-panel)',
                                        border: '1px solid var(--border)',
                                        padding: '0.8rem',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem', borderRadius: '6px' }}><Clipboard size={16} color="#10b981" /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Paste & Optimize</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyze clipboard content</div>
                                    </div>
                                    <ArrowRight size={14} color="var(--text-muted)" />
                                </button>
                            </div>

                            {/* Trust Builder */}
                            <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', opacity: 0.7 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Detects Anti-Patterns</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Safe Refactoring</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};

export default RefactorPage;
