import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange }) => {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => onChange(value || '')}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible'
                    }
                }}
            />
        </div>
    );
};

export default CodeEditor;
