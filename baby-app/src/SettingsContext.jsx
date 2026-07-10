import { createContext, useContext, useEffect, useState } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from './firebase'

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
    const r = ref(db, 'baby/settings')
    return onValue(r, snap => {
      if (snap.exists()) setSettings({ ...DEFAULT_SETTINGS, ...snap.val() })
      setLoading(false)
    })
  }, [])

  function saveSettings(next) {
    setSettings(next)
    set(ref(db, 'baby/settings'), next)
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
