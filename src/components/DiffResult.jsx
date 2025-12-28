import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

const DiffResult = ({ original, modified }) => {
    return (
        <div style={{ height: '400px', width: '100%', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <DiffEditor
                height="100%"
                original={original}
                modified={modified}
                language="javascript"
                theme="vs-dark"
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderSideBySide: true
                }}
            />
        </div>
    );
};

export default DiffResult;
