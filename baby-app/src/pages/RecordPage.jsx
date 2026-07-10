import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../SettingsContext'
import { useRecords } from '../hooks/useRecords'
import Timeline from '../components/Timeline'

const COLORS = { sleep: '#E91E8C', play: '#F5A623', feed: '#6CC83A' }

function formatElapsed(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0')
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function getDday(birthDate) {
  const today = new Date(); today.setHours(0,0,0,0)
  const birth = new Date(birthDate); birth.setHours(0,0,0,0)
  return Math.floor((today - birth) / 86400000) + 1
}

/* ── 수면 행 ── */
function SleepRow({ session, onStart, onStop }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!session) return
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - session.startTime) / 1000)), 1000)
    return () => clearInterval(iv)
  }, [session])

  return (
    <div style={rowStyle}>
      <div style={{ ...cardStyle, background: COLORS.sleep }}>
        <span style={emojiStyle}>🌙</span>
        <span style={nameStyle}>수면</span>
        {session && <span style={badgeStyle} />}
      </div>
      <div style={actionStyle}>
        {session ? (
          <>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, fontVariantNumeric: 'tabular-nums' }}>
              {formatElapsed(elapsed)}
            </div>
            <button style={stopBtnStyle} onClick={onStop}>종료</button>
          </>
        ) : (
          <button style={{ ...startBtnStyle, borderColor: COLORS.sleep, color: COLORS.sleep }} onClick={onStart}>
            시작하기
          </button>
        )}
      </div>
    </div>
  )
}

/* ── 놀이 행 ── */
function PlayRow({ options, onSave }) {
  const [pending, setPending] = useState(null) // { id, label }
  const [minutes, setMinutes] = useState('')
  const inputRef = useRef(null)

  function open(opt) {
    setPending(opt)
    setMinutes('')
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  function save() {
    const m = parseInt(minutes)
    if (!m || m < 1) { inputRef.current?.focus(); return }
    const endTime = Date.now()
    onSave({ type: 'play', subtype: pending.id, startTime: endTime - m * 60000, endTime })
    setPending(null)
  }

  return (
    <div style={rowStyle}>
      <div style={{ ...cardStyle, background: COLORS.play }}>
        <span style={emojiStyle}>🧸</span>
        <span style={nameStyle}>놀이</span>
      </div>
      <div style={actionStyle}>
        {pending ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.play }}>{pending.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                ref={inputRef}
                type="number" min="1" max="180"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()}
                placeholder="0"
                style={minuteInputStyle}
              />
              <span style={{ fontSize: 22, fontWeight: 700, color: '#555' }}>분</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={cancelBtnStyle} onClick={() => setPending(null)}>취소</button>
              <button style={{ ...saveBtnStyle, background: COLORS.play }} onClick={save}>저장</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flex: 1, gap: 8, width: '100%' }}>
            {options.map(opt => (
              <button
                key={opt.id}
                style={{ ...startBtnStyle, flex: 1, fontSize: 20, borderColor: COLORS.play, color: COLORS.play }}
                onClick={() => open(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── 수유 행 ── */
function FeedRow({ options, onSave }) {
  const [recorded, setRecorded] = useState(null)

  function record(opt) {
    const startTime = Date.now()
    onSave({ type: 'feed', subtype: opt.id, startTime, endTime: startTime + 15 * 60000 })
    setRecorded(opt.id)
    setTimeout(() => setRecorded(null), 1500)
  }

  return (
    <div style={rowStyle}>
      <div style={{ ...cardStyle, background: COLORS.feed }}>
        <span style={emojiStyle}>🍼</span>
        <span style={nameStyle}>수유</span>
      </div>
      <div style={actionStyle}>
        <div style={{ display: 'flex', flex: 1, gap: 8, width: '100%' }}>
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => record(opt)}
              style={{
                ...startBtnStyle, flex: 1, fontSize: 20,
                borderColor: recorded === opt.id ? COLORS.feed : COLORS.feed,
                color:       recorded === opt.id ? '#fff' : COLORS.feed,
                background:  recorded === opt.id ? COLORS.feed : '#fff',
                transition: 'none',
              }}
            >
              {recorded === opt.id ? '✓ 기록됨' : opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 메인 ── */
export default function RecordPage() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { records, saveRecord } = useRecords()
  const [sleepSession, setSleepSession] = useState(() => {
    const s = localStorage.getItem('baby_sleep_session')
    return s ? JSON.parse(s) : null
  })

  function startSleep() {
    const session = { startTime: Date.now() }
    setSleepSession(session)
    localStorage.setItem('baby_sleep_session', JSON.stringify(session))
  }

  function stopSleep() {
    if (!sleepSession) return
    saveRecord({ type: 'sleep', startTime: sleepSession.startTime, endTime: Date.now() })
    setSleepSession(null)
    localStorage.removeItem('baby_sleep_session')
  }

  const activeSessions = sleepSession ? { sleep: sleepSession } : {}

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', gap: 16 }}>
      {/* 타임라인 패널 */}
      <div style={{ flex: 38, background: '#fff', borderRadius: 16, padding: '16px 12px 16px 8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#333', letterSpacing: 2 }}>👼🏻 이안이의 하루</div>
          <div style={{ padding: '4px 14px', background: '#FFE8F2', color: '#E91E8C', borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
            D+{getDday(settings.birthDate)}
          </div>
        </div>
        <Timeline records={records} activeSessions={activeSessions} />
      </div>

      {/* 컨트롤 패널 */}
      <div style={{ flex: 62, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SleepRow session={sleepSession} onStart={startSleep} onStop={stopSleep} />
        <PlayRow  options={settings.playOptions} onSave={saveRecord} />
        <FeedRow  options={settings.feedOptions} onSave={saveRecord} />
      </div>

      {/* 설정/주간 버튼 */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', gap: 8 }}>
        <button onClick={() => navigate('/weekly')} style={navBtnStyle}>📅 주간</button>
        <button onClick={() => navigate('/settings')} style={navBtnStyle}>⚙️ 설정</button>
      </div>
    </div>
  )
}

/* ── 공통 스타일 ── */
const rowStyle    = { flex: 1, display: 'flex', gap: 12, alignItems: 'stretch' }
const cardStyle   = { flex: 4, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#fff', userSelect: 'none', position: 'relative' }
const emojiStyle  = { fontSize: 32, lineHeight: 1 }
const nameStyle   = { fontSize: 22, fontWeight: 700 }
const badgeStyle  = { position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: '50%', background: '#fff', animation: 'pulse 1.4s infinite', boxShadow: '0 0 0 0 rgba(255,255,255,0.6)' }
const actionStyle = { flex: 5, background: '#fff', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16, overflow: 'hidden' }
const startBtnStyle = { flex: 1, width: '100%', padding: '18px 0', border: '3px solid', borderRadius: 16, fontSize: 26, fontWeight: 700, background: '#fff', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }
const stopBtnStyle  = { width: 160, padding: '14px 0', border: '2px solid #ddd', borderRadius: 14, fontSize: 18, fontWeight: 700, color: '#555', background: '#fff', cursor: 'pointer' }
const minuteInputStyle = { width: 90, fontSize: 36, fontWeight: 700, textAlign: 'center', border: `2.5px solid ${COLORS.play}`, borderRadius: 14, padding: '6px 8px', color: '#333', outline: 'none', WebkitAppearance: 'none', appearance: 'none' }
const cancelBtnStyle   = { padding: '12px 22px', border: '2px solid #ddd', borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#aaa', background: '#fff', cursor: 'pointer' }
const saveBtnStyle     = { padding: '12px 28px', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#fff', cursor: 'pointer' }
const navBtnStyle      = { padding: '10px 18px', border: 'none', borderRadius: 20, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(6px)' }
