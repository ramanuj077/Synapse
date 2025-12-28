import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import SettingsModal from './components/SettingsModal'
import RefactorPage from './pages/RefactorPage'
import HistoryPage from './pages/HistoryPage'
import PatternsPage from './pages/PatternsPage'
import DocsPage from './pages/DocsPage'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState({
    arrowFunctions: false,
    customInstructions: ''
  })

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          preferences={preferences}
          onSave={setPreferences}
        />

        <main className="container flex-1" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<RefactorPage preferences={preferences} />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
