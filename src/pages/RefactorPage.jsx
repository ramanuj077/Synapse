import React, { useState } from 'react';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import RefactorResult from '../components/RefactorResult';
import { FadeIn } from '../components/Animations';

const RefactorPage = ({ preferences }) => {
    const [inputCode, setInputCode] = useState(`// 🚀 Synapse 2.1: Paste code OR a GitHub File URL...
// Example: https://github.com/facebook/react/blob/main/packages/react/index.js

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

    const handleRefactor = async () => {
        if (!inputCode || !inputCode.trim()) {
            alert('Please enter some code to analyze.');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);

        try {
            // Call Backend
            const response = await axios.post('http://localhost:5000/api/analyze', {
                code: inputCode,
                preferences,
                refactorType
            });
            setResult(response.data);
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

    return (
        <FadeIn className="flex flex-col h-full gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 700, margin: 0 }}>
                        <span style={{ background: 'linear-gradient(to right, #ffffff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Workbench
                        </span>
                    </h2>
                    <p className="text-muted" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Enterprise Engineering Analytics
                    </p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={refactorType}
                        onChange={(e) => setRefactorType(e.target.value)}
                        className="btn-secondary"
                        style={{
                            background: '#18181b',
                            color: '#fff',
                            padding: '0.8rem 1rem',
                            border: '1px solid var(--border)',
                            minWidth: '160px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="clean-code">✨ Clean Code</option>
                        <option value="performance">⚡ Performance</option>
                        <option value="readability">📖 Readability</option>
                        <option value="security">🛡️ Security</option>
                    </select>

                    <button
                        className="btn-glow"
                        onClick={handleRefactor}
                        disabled={isAnalyzing}
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        {isAnalyzing ? (
                            <>
                                <span className="spinner">⚡</span> Processing
                            </>
                        ) : (
                            <>
                                <span style={{ marginRight: '8px' }}>✨</span> Run Optimization
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
                {/* Editor Side */}
                <div className="mac-window">
                    <div className="mac-header">
                        <div className="flex gap-2">
                            <div className="mac-dot red"></div>
                            <div className="mac-dot yellow"></div>
                            <div className="mac-dot green"></div>
                        </div>
                        <div className="mac-title">legacy_module.js</div>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', padding: '0' }}>
                        <CodeEditor code={inputCode} onChange={setInputCode} label="" />
                    </div>
                </div>

                {/* Result Side */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="card-content">
                        <RefactorResult
                            data={result}
                            onApply={(newCode) => {
                                setInputCode(newCode);
                                setResult(null);
                            }}
                        />
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default RefactorPage;
