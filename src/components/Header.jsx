import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, User, LayoutDashboard, Settings, Sun, Moon } from 'lucide-react';

const Header = ({ onOpenSettings }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [theme, setTheme] = React.useState('light'); // Default to light

  // Initialize theme from localStorage or system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'white' : 'var(--text-muted)',
    fontWeight: location.pathname === path ? 500 : 400,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: location.pathname === path ? '2px solid var(--primary)' : '2px solid transparent',
    transition: 'all 0.2s'
  });

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '1rem 0',
      background: 'rgba(5, 5, 10, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container flex justify-between items-center">
        <div className="logo flex items-center gap-4">
          <Link to={isAuthenticated ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--primary-glow)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              margin: 0,
              background: 'linear-gradient(to right, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SYNAPSE
            </h1>
          </Link>
        </div>

        <nav className="flex gap-8">
          {isAuthenticated && (
            <Link to="/dashboard" style={linkStyle('/dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}
          <Link to="/" style={linkStyle('/')}>Refactor</Link>
          <Link to="/history" style={linkStyle('/history')}>History</Link>
          <Link to="/patterns" style={linkStyle('/patterns')}>Patterns</Link>
          <Link to="/docs" style={linkStyle('/docs')}>Docs</Link>
        </nav>

        <div className="user-profile flex items-center gap-6">
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.4rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={onOpenSettings}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            title="Settings"
          >
            <Settings size={18} />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Plan</div>
              </div>
              <div style={{
                position: 'relative',
                cursor: 'pointer'
              }} className="group">
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1f2937, #111827)',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <User size={18} />
                </div>

                {/* Logout Button (Hover or Click) */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginLeft: '1rem'
                  }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                Log In
              </Link>
              <Link to="/signup" className="btn-glow" style={{
                textDecoration: 'none',
                padding: '0.6rem 1.4rem',
                fontSize: '0.9rem',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
