import { HashRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './SettingsContext'
import RecordPage  from './pages/RecordPage'
import WeeklyPage  from './pages/WeeklyPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <SettingsProvider>
      <div style={{
        fontFamily: "-apple-system, 'Apple SD Gothic Neo', sans-serif",
        background: '#f0f2f5',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '100%', height: '100%', maxHeight: 740, display: 'flex' }}>
          <HashRouter>
            <Routes>
              <Route path="/"         element={<RecordPage />} />
              <Route path="/weekly"   element={<WeeklyPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </SettingsProvider>
  )
}
