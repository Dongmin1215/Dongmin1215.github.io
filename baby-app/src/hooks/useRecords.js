import { useCallback, useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function localDateKey(date) {
  const d = date ?? new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useRecords(date) {
  const key = localDateKey(date)
  const [records, setRecords] = useState([])

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/records/${key}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setRecords(await res.json())
    } catch (err) {
      console.error('[useRecords] fetch error:', err)
    }
  }, [key])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  async function saveRecord(record) {
    try {
      const res = await fetch(`${API}/api/records/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      fetchRecords()
    } catch (err) {
      console.error('[saveRecord] error:', err)
    }
  }

  return { records, saveRecord }
}
