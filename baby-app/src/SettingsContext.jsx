import { createContext, useContext, useEffect, useState } from 'react'

const API = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://dongmin1215-github-io.onrender.com'

const DEFAULT_SETTINGS = {
  birthDate: '2026-04-15',
  playOptions: [
    { id: 'tummy_time', label: '터미타임' },
    { id: 'baby_gym',   label: '아기 체육관' },
  ],
  feedOptions: [
    { id: '150ml', label: '150ml' },
    { id: '180ml', label: '180ml' },
  ],
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(res => res.json())
      .then(data => { if (data) setSettings({ ...DEFAULT_SETTINGS, ...data }) })
      .catch(err => console.error('[settings] fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  async function saveSettings(next) {
    setSettings(next)
    try {
      await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
    } catch (err) {
      console.error('[settings] save error:', err)
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
