import { useMemo } from 'react'

const TIMELINE_START = 6
const TIMELINE_END   = 22
const TOTAL_HOURS    = TIMELINE_END - TIMELINE_START

const TYPE_COLOR = { sleep: '#E91E8C', play: '#F5A623', feed: '#6CC83A' }

function timeToPercent(ts) {
  const d = new Date(ts)
  const hours = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600
  return Math.min(100, Math.max(0, (hours - TIMELINE_START) / TOTAL_HOURS * 100))
}

const hours = Array.from({ length: TIMELINE_END - TIMELINE_START + 1 }, (_, i) => i + TIMELINE_START)

export default function Timeline({ records, activeSessions = {} }) {
  const nowPct = timeToPercent(Date.now())

  const blocks = useMemo(() => {
    const result = []
    records.forEach(rec => {
      const top    = timeToPercent(rec.startTime)
      const bottom = timeToPercent(rec.endTime)
      if (bottom > top) result.push({ ...rec, top, height: bottom - top, live: false })
    })
    Object.entries(activeSessions).forEach(([type, session]) => {
      const top    = timeToPercent(session.startTime)
      const bottom = timeToPercent(Date.now())
      if (bottom > top) result.push({ type, top, height: bottom - top, live: true })
    })
    return result
  }, [records, activeSessions])

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 4 }}>
      {/* 시간 레이블 */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 36, flexShrink: 0, paddingRight: 4 }}>
        {hours.map(h => (
          <div key={h} style={{ fontSize: 11, color: '#aaa', textAlign: 'right', lineHeight: 1 }}>
            {h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`}
          </div>
        ))}
      </div>

      {/* 트랙 */}
      <div style={{ flex: 1, position: 'relative', background: '#f8f8f8', borderRadius: 8, overflow: 'hidden' }}>
        {/* 눈금선 */}
        {hours.slice(1).map(h => (
          <div key={h} style={{
            position: 'absolute',
            left: 0, right: 0,
            top: `${((h - TIMELINE_START) / TOTAL_HOURS) * 100}%`,
            height: 1,
            background: '#eee',
          }} />
        ))}

        {/* 활동 블록 */}
        {blocks.map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: '10%', width: '80%',
            top: `${b.top}%`,
            height: `${b.height}%`,
            background: TYPE_COLOR[b.type] ?? '#ccc',
            borderRadius: 6,
            opacity: b.live ? 1 : 0.85,
          }} />
        ))}

        {/* 현재 시각 선 */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: `${nowPct}%`, height: 2, background: '#ff3b30', zIndex: 5 }}>
          <div style={{ position: 'absolute', left: -4, top: -4, width: 10, height: 10, borderRadius: '50%', background: '#ff3b30' }} />
        </div>
      </div>
    </div>
  )
}
