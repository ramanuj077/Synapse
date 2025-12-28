import { useState } from 'react';
import { FadeIn } from '../components/Animations';

const DOCS_CONTENT = {
    'intro': {
        title: 'Introduction to Synapse',
        content: (
            <>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                    Synapse is an <strong>AI-powered refactoring assistant</strong> designed to bridge the gap between static analysis and human-like reasoning. Unlike traditional linters that catch syntax errors, Synapse understands the <em>intent</em> of your code and suggests architectural improvements.
                </p>
                <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-main)', marginTop: 0 }}>Why Refactor?</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                        Code debt accumulates silently. Refactoring is not just about cleaning up—it's about making your system robust, scalable, and easier to maintain. Synapse automates this process by identifying complexity hotspots.
                    </p>
                </div>
            </>
        )
    },
    'installation': {
        title: 'Installation',
        content: (
            <>
                <p className="text-muted">Since Synapse is a web-based platform, no local installation is required for the client. However, if you are running the backend locally:</p>
                <pre style={{ background: '#111', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <code>git clone https://github.com/synapse-core/synapse.git{'\n'}cd synapse{'\n'}npm install{'\n'}npm run dev</code>
                </pre>
            </>
        )
    },
    'quick-start': {
        title: 'Quick Start',
        content: (
            <>
                <p className="text-muted">1. Navigate to the <strong>Refactor Workbench</strong>.</p>
                <p className="text-muted">2. Paste your legacy code snippet into the editor.</p>
                <p className="text-muted">3. Select your desired <strong>Refactor Type</strong> (e.g., Clean Code, Performance).</p>
                <p className="text-muted">4. Click <strong>Run Optimization</strong>.</p>
            </>
        )
    },
    'smells': {
        title: 'Code Smells',
        content: <p className="text-muted">Synapse detects common anti-patterns like <strong>Deep Nesting</strong>, <strong>God Functions</strong>, and <strong>Magic Numbers</strong>.</p>
    },
    'strategies': {
        title: 'Refactoring Strategies',
        content: <p className="text-muted">We employ techniques such as <strong>Extract Method</strong>, <strong>Inline Temp</strong>, and <strong>Replace Loop with Pipeline</strong>.</p>
    },
    'ai-engines': {
        title: 'AI Engines',
        content: <p className="text-muted">Synapse is powered by a Hybrid Architecture combining <strong>Google Gemini 1.5 Flash</strong> for generative reasoning and <strong>Babel AST</strong> for static verification.</p>
    }
};

const DocsPage = () => {
    const [activeDoc, setActiveDoc] = useState('intro');

    return (
        <FadeIn className="container h-full flex gap-8">
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card" style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Getting Started</h4>
                    <ul className="docs-nav" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><button onClick={() => setActiveDoc('intro')} className={activeDoc === 'intro' ? 'active' : ''}>Introduction</button></li>
                        <li><button onClick={() => setActiveDoc('installation')} className={activeDoc === 'installation' ? 'active' : ''}>Installation</button></li>
                        <li><button onClick={() => setActiveDoc('quick-start')} className={activeDoc === 'quick-start' ? 'active' : ''}>Quick Start</button></li>
                    </ul>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Core Concepts</h4>
                    <ul className="docs-nav" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><button onClick={() => setActiveDoc('smells')} className={activeDoc === 'smells' ? 'active' : ''}>Code Smells</button></li>
                        <li><button onClick={() => setActiveDoc('strategies')} className={activeDoc === 'strategies' ? 'active' : ''}>Refactoring Strategies</button></li>
                        <li><button onClick={() => setActiveDoc('ai-engines')} className={activeDoc === 'ai-engines' ? 'active' : ''}>AI Engines</button></li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="card flex-1" style={{ padding: '3rem', overflow: 'auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{DOCS_CONTENT[activeDoc].title}</h1>
                {DOCS_CONTENT[activeDoc].content}
            </div>

            <style>{`
                .docs-nav button {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 1rem;
                    text-align: left;
                    padding: 0;
                    margin: 0;
                    transition: color 0.2s;
                    font-family: var(--font-main);
                }
                .docs-nav button:hover {
                    color: var(--text-main);
                }
                .docs-nav button.active {
                    color: var(--accent);
                    font-weight: 600;
                }
            `}</style>
        </FadeIn>
    );
};

export default DocsPage;
