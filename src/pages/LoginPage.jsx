import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by the store
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{
            minHeight: '100vh', /* Ensure it covers viewport even if content is small */
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #000000 100%)',
            padding: '2rem',
            position: 'fixed', /* Force full viewport coverage */
            top: 0,
            left: 0,
            zIndex: 50, /* Ensure it sits on top of layout if needed */
            overflowY: 'auto'
        }}>
            {/* Ambient Background Effects */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '20%',
                width: '400px',
                height: '400px',
                background: 'rgba(99, 102, 241, 0.15)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'rgba(168, 85, 247, 0.15)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div className="animate-slide-up" style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(20, 20, 23, 0.7)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                position: 'relative'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(to right, #fff, #a5b4fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Enter your credentials to access the core.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="animate-fade-in" style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#f87171',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#e2e8f0'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative', group: true }}>
                            <Mail size={18} style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                pointerEvents: 'none'
                            }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="name@company.com"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'var(--font-main)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#818cf8';
                                    e.target.style.background = 'rgba(99, 102, 241, 0.05)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#e2e8f0'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                pointerEvents: 'none'
                            }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'var(--font-main)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#818cf8';
                                    e.target.style.background = 'rgba(99, 102, 241, 0.05)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-glow"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner">⚡</span>
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Sign In <LogIn size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        New to Synapse?{' '}
                        <Link to="/signup" style={{
                            color: '#818cf8',
                            textDecoration: 'none',
                            fontWeight: 600,
                            borderBottom: '1px solid transparent',
                            transition: 'all 0.2s'
                        }}
                            onMouseOver={(e) => e.target.style.borderBottomColor = '#818cf8'}
                            onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
