import { useEffect, useState } from 'react'
import { ref, onValue, push, set as fbSet } from 'firebase/database'
import { db } from '../firebase'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function dateKey(date) {
  return date.toISOString().slice(0, 10)
}

export function useRecords(date) {
  const key = date ? dateKey(date) : todayKey()
  const [records, setRecords] = useState([])

  useEffect(() => {
    const r = ref(db, `baby/records/${key}`)
    return onValue(r, snap => {
      const list = []
      snap.forEach(child => list.push({ _id: child.key, ...child.val() }))
      setRecords(list)
    })
  }, [key])

  function saveRecord(record) {
    const dayRef = ref(db, `baby/records/${key}`)
    push(dayRef).then(newRef => fbSet(newRef, record))
  }

  return { records, saveRecord }
}
