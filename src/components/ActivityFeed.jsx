import React, { useEffect, useState } from 'react';
import { User, GitCommit, AlertTriangle, CheckCircle } from 'lucide-react';

const activities = [
    { user: 'Alex M.', action: 'refactored', target: 'auth_service.js', time: '2m ago', type: 'success' },
    { user: 'Sarah K.', action: 'detected', target: 'memory leak in data_pipeline.py', time: '5m ago', type: 'warning' },
    { user: 'System', action: 'completed', target: 'nightly build analysis', time: '12m ago', type: 'info' },
    { user: 'Mike R.', action: 'pushed', target: 'feature/new-login', time: '1h ago', type: 'commit' },
    { user: 'Synapse AI', action: 'optimized', target: 'rendering logic (45% faster)', time: '2h ago', type: 'success' }
];

const ActivityItem = ({ item }) => {
    let Icon = User;
    let color = 'var(--text-muted)';

    if (item.type === 'success') { Icon = CheckCircle; color = '#10b981'; }
    if (item.type === 'warning') { Icon = AlertTriangle; color = '#f59e0b'; }
    if (item.type === 'commit') { Icon = GitCommit; color = '#6366f1'; }

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'start',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{
                marginTop: '2px',
                color: color
            }}>
                <Icon size={16} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.user}</span>{' '}
                    <span style={{ color: 'var(--text-muted)' }}>{item.action}</span>{' '}
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.target}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {item.time}
                </div>
            </div>
        </div>
    );
};

const ActivityFeed = () => {
    return (
        <div className="card-premium">
            <div style={{
                padding: '1.25rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Team Activity</h3>
                <span className="live-indicator">
                    <span className="dot"></span> Live
                </span>
            </div>
            <div style={{ padding: '0 1.25rem' }}>
                {activities.map((item, i) => (
                    <ActivityItem key={i} item={item} />
                ))}
            </div>
            <div style={{
                padding: '1rem',
                textAlign: 'center',
                borderTop: '1px solid var(--border)',
                marginTop: '0.5rem'
            }}>
                <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#818cf8',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: 500
                }}>
                    View Full Log
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;
