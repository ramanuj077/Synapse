import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import SettingsModal from './components/SettingsModal'
import RefactorPage from './pages/RefactorPage'
import HistoryPage from './pages/HistoryPage'
import PatternsPage from './pages/PatternsPage'
import DocsPage from './pages/DocsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/authStore'

const AppContent = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState({
    arrowFunctions: false,
    customInstructions: ''
  })

  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!isAuthPage && <Header onOpenSettings={() => setIsSettingsOpen(true)} />}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSave={setPreferences}
      />

      <main className="container flex-1" style={{
        padding: isAuthPage ? 0 : '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RefactorPage preferences={preferences} />} />
          <Route path="/patterns" element={<PatternsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
