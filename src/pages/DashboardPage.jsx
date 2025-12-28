import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FadeIn } from '../components/Animations';
import ActivityFeed from '../components/ActivityFeed';
import SystemStatus from '../components/SystemStatus';
import {
    LayoutDashboard,
    Code,
    Github,
    Zap,
    Shield,
    Clock,
    ArrowRight,
    TrendingUp
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="card-premium" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: `rgba(${color}, 0.1)`,
            color: `rgb(${color})`
        }}>
            <Icon size={24} />
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
                {trend && (
                    <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center' }}>
                        <TrendingUp size={12} style={{ marginRight: '2px' }} /> {trend}
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ProjectCard = ({ type, title, date, status }) => (
    <div className="card-premium h-hover" style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: type === 'repo' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: type === 'repo' ? '#6366f1' : '#10b981'
                }}>
                    {type === 'repo' ? <Github size={18} /> : <Code size={18} />}
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{date}</span>
                </div>
            </div>
            <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                background: status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : status === 'Failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: status === 'Completed' ? '#10b981' : status === 'Failed' ? '#ef4444' : '#f59e0b'
            }}>
                {status}
            </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Zap size={14} color="#f59e0b" /> 5 smells
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Shield size={14} color="#10b981" /> A- Grade
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const { user, token } = useAuthStore();
    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState({
        totalAnalyses: 0,
        smellsFixed: 0,
        timeSaved: 0,
        recentProjects: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {};
                if (token) {
                    config.headers = { Authorization: `Bearer ${token}` };
                }
                const response = await fetch('http://localhost:5000/api/dashboard/stats', {
                    headers: config.headers
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <span className="spinner">⚡</span> Loading Dashboard...
            </div>
        );
    }

    return (
        <FadeIn className="flex flex-col h-full gap-8">
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {greeting}, <span className="text-gradient">{user?.name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Your code optimization command center.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/" className="btn-glow" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={18} /> New Analysis
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard icon={LayoutDashboard} label="Total Analyses" value={stats.totalAnalyses} trend="Lifetime" color="99, 102, 241" />
                <StatCard icon={Zap} label="Smells Resolved" value={stats.smellsFixed} trend="+12% this week" color="245, 158, 11" />
                <StatCard icon={Clock} label="Time Saved" value={`${stats.timeSaved}h`} trend="Estimated" color="16, 185, 129" />
                <StatCard icon={Shield} label="Security Score" value="98%" color="239, 68, 68" />
            </div>

            {/* Main Layout Grid (2 Columns: 2/3 Main, 1/3 Sidebar) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flex: 1 }}>

                {/* Left Column: Projects & Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Quick Actions Bar */}
                    <div className="card-premium" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#818cf8' }}>
                                <Code size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Quick Actions</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Common tasks</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/history" className="h-hover" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}>View History</Link>
                            <Link to="/docs" className="h-hover" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}>Documentation</Link>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Projects</h3>
                            <Link to="/history" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View all <ArrowRight size={14} /></Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats.recentProjects.length > 0 ? (
                                stats.recentProjects.map((project, idx) => (
                                    <ProjectCard
                                        key={idx}
                                        type={project.type}
                                        title={project.title}
                                        date={new Date(project.date).toLocaleDateString()}
                                        status={project.status}
                                    />
                                ))
                            ) : (
                                <div className="card-premium" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '50%' }}><Code size={32} className="text-muted" /></div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No projects yet</p>
                                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Start your first analysis to see data here.</p>
                                    </div>
                                    <Link to="/" className="btn-secondary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>Start Analyzing</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar (System & Feed) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* System Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>System Health</h3>
                        <SystemStatus />
                    </div>

                    {/* Activity Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Live Activity</h3>
                            <span className="live-indicator"><span className="dot"></span> Live</span>
                        </div>
                        <ActivityFeed />
                    </div>
                </div>

            </div>
        </FadeIn>
    );
};

export default DashboardPage;
