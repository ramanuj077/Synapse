import { ShieldCheck, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

const SafetyBadges = ({ data }) => {
    // Determine safety metrics from the analysis data
    const isProductionSafe = data?.risk_score < 20;
    const hasBreakingChanges = data?.safety_status === 'syntax_warning';
    const isStable = data?.metrics?.complexity_after < data?.metrics?.complexity_before;
    const isOptimized = data?.metrics?.lines_saved > 0;

    const badges = [];

    if (isProductionSafe) {
        badges.push({
            icon: ShieldCheck,
            label: 'Production Safe',
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            description: 'Low risk of runtime issues'
        });
    }

    if (!hasBreakingChanges) {
        badges.push({
            icon: CheckCircle2,
            label: 'No Breaking Changes',
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            description: 'Behavior preserved'
        });
    }

    if (isStable) {
        badges.push({
            icon: CheckCircle2,
            label: 'Improved Stability',
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            description: 'Reduced complexity'
        });
    }

    if (isOptimized) {
        badges.push({
            icon: Zap,
            label: 'Code Optimized',
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            description: `${data.metrics.lines_saved} lines reduced`
        });
    }

    // Warning badge if there are issues
    if (hasBreakingChanges) {
        badges.push({
            icon: AlertTriangle,
            label: 'Manual Review Required',
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            description: 'Please verify changes carefully'
        });
    }

    if (badges.length === 0) return null;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(59, 130, 246, 0.03))',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#10b981" />
                <h4 style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#6ee7b7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Safety Status
                </h4>
            </div>

            {/* Badges Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem'
            }}>
                {badges.map((badge, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: badge.bgColor,
                            border: `1px solid ${badge.borderColor}`,
                            borderRadius: '10px',
                            transition: 'transform 0.2s',
                            cursor: 'default'
                        }}
                        title={badge.description}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 4px 12px ${badge.color}30`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <badge.icon size={20} color={badge.color} />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: badge.color,
                                marginBottom: '0.1rem'
                            }}>
                                {badge.label}
                            </div>
                            <div style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)'
                            }}>
                                {badge.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SafetyBadges;
