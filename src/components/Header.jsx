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
            <img
              src="/logo.png"
              alt="Synapse Logo"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
              }}
            />
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
          <Link to="/extension" style={{ ...linkStyle('/extension'), background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>VS Code Extension</Link>
        </nav>

        <div className="user-profile flex items-center gap-4">
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.6rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              minWidth: '40px',
              minHeight: '40px'
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
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.6rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              minWidth: '40px',
              minHeight: '40px'
            }}
            title="Settings"
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Settings size={18} />
          </button>

          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingRight: '1rem',
                borderRight: '1px solid var(--border)'
              }}>
                <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name || 'User'}</div>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <User size={18} />
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '0.6rem',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  minWidth: '40px',
                  minHeight: '40px'
                }}
                title="Sign Out"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                <LogOut size={18} />
              </button>
            </>
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

