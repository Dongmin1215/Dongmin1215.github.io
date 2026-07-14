import { readFileSync } from 'fs'
import express from 'express'
import cors from 'cors'
import { initializeApp, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})

const db = getDatabase()
const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

app.get('/api/records/:date', async (req, res) => {
  try {
    const snap = await db.ref(`baby/records/${req.params.date}`).once('value')
    const records = []
    snap.forEach(child => records.push({ _id: child.key, ...child.val() }))
    res.json(records)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/records/:date', async (req, res) => {
  try {
    const newRef = db.ref(`baby/records/${req.params.date}`).push()
    await newRef.set(req.body)
    res.json({ _id: newRef.key })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/settings', async (req, res) => {
  try {
    const snap = await db.ref('baby/settings').once('value')
    res.json(snap.val())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/settings', async (req, res) => {
  try {
    await db.ref('baby/settings').set(req.body)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`baby-server running on :${PORT}`))
