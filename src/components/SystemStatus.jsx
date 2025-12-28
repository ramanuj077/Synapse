import React from 'react';
import { Server, Database, Cloud } from 'lucide-react';

const StatusRow = ({ icon: Icon, label, status }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Icon size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: status === 'operational' ? '#10b981' : '#f59e0b',
                boxShadow: status === 'operational' ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
            }} />
            <span style={{
                fontSize: '0.8rem',
                color: status === 'operational' ? '#10b981' : '#f59e0b',
                fontWeight: 500
            }}>
                {status === 'operational' ? 'Operational' : 'Degraded'}
            </span>
        </div>
    </div>
);

const SystemStatus = () => {
    return (
        <div className="card-premium h-full">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>System Health</h3>
            </div>
            <div style={{ padding: '0 1.25rem' }}>
                <StatusRow icon={Server} label="API Gateway" status="operational" />
                <StatusRow icon={Database} label="PostgreSQL DB" status="operational" />
                <StatusRow icon={Cloud} label="AI Inference Engine" status="operational" />
                <StatusRow icon={Server} label="Legacy Code Parser" status="operational" />
            </div>
        </div>
    );
};

export default SystemStatus;
