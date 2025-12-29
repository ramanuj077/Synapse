import { CheckCircle2, TrendingUp } from 'lucide-react';

const CodeHealthScore = ({ before, after }) => {
    const improvement = after - before;
    const getGrade = (score) => {
        if (score >= 80) return { grade: 'A', color: '#10b981' };
        if (score >= 60) return { grade: 'B', color: '#3b82f6' };
        if (score >= 40) return { grade: 'C', color: '#f59e0b' };
        return { grade: 'D', color: '#ef4444' };
    };

    const beforeGrade = getGrade(before);
    const afterGrade = getGrade(after);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={24} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#6ee7b7' }}>
                    Code Health Score
                </h3>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {/* Before */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Before
                    </div>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `conic-gradient(${beforeGrade.color} ${before}%, rgba(255,255,255,0.1) 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            background: 'var(--bg-card)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: beforeGrade.color }}>
                                {before}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: beforeGrade.color }}>
                                {beforeGrade.grade}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div style={{ fontSize: '2rem', color: '#10b981' }}>→</div>

                {/* After */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        After Refactor
                    </div>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `conic-gradient(${afterGrade.color} ${after}%, rgba(255,255,255,0.1) 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        position: 'relative',
                        boxShadow: `0 0 20px ${afterGrade.color}40`
                    }}>
                        <div style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            background: 'var(--bg-card)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: afterGrade.color }}>
                                {after}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: afterGrade.color }}>
                                {afterGrade.grade}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Improvement Badge */}
                <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <TrendingUp size={20} color="#10b981" />
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                        +{improvement}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        improvement
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeHealthScore;
