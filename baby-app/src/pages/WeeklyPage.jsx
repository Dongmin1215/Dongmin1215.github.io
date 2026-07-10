import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecords } from '../hooks/useRecords'
import Timeline from '../components/Timeline'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const TYPE_COLOR = { sleep: '#E91E8C', play: '#F5A623', feed: '#6CC83A' }
const TYPE_LABEL = { sleep: '수면', play: '놀이', feed: '수유' }

function getWeekDates(base) {
  const day = base.getDay()
  const monday = new Date(base)
  monday.setDate(base.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function DayColumn({ date }) {
  const { records } = useRecords(date)
  const isToday = date.toDateString() === new Date().toDateString()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ textAlign: 'center', padding: '6px 0', borderRadius: 10, background: isToday ? '#FFE8F2' : 'transparent' }}>
        <div style={{ fontSize: 11, color: isToday ? '#E91E8C' : '#888' }}>{DAYS[date.getDay()]}</div>
        <div style={{ fontSize: 13, fontWeight: isToday ? 800 : 500, color: isToday ? '#E91E8C' : '#333' }}>{formatDate(date)}</div>
      </div>
      <Timeline records={records} />
    </div>
  )
}

function WeeklySummary({ dates }) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', padding: '10px 0' }}>
      {Object.entries(TYPE_COLOR).map(([type, color]) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
          <span style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>{TYPE_LABEL[type]}</span>
        </div>
      ))}
    </div>
  )
}

export default function WeeklyPage() {
  const navigate = useNavigate()
  const [baseDate, setBaseDate] = useState(new Date())
  const weekDates = getWeekDates(baseDate)

  function prevWeek() {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - 7)
    setBaseDate(d)
  }

  function nextWeek() {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + 7)
    setBaseDate(d)
  }

  const weekLabel = `${formatDate(weekDates[0])} ~ ${formatDate(weekDates[6])}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: 8 }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 16, padding: '12px 20px', flexShrink: 0 }}>
        <button onClick={() => navigate('/')} style={navBtnStyle}>← 기록</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={prevWeek} style={arrowBtnStyle}>‹</button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#333', minWidth: 120, textAlign: 'center' }}>{weekLabel}</span>
          <button onClick={nextWeek} style={arrowBtnStyle}>›</button>
        </div>
        <WeeklySummary dates={weekDates} />
      </div>

      {/* 주간 타임라인 */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 16, display: 'flex', gap: 8, overflow: 'hidden' }}>
        {weekDates.map((date, i) => (
          <DayColumn key={i} date={date} />
        ))}
      </div>
    </div>
  )
}

const navBtnStyle   = { padding: '8px 16px', border: 'none', borderRadius: 12, background: '#f0f2f5', color: '#555', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const arrowBtnStyle = { padding: '6px 14px', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', fontSize: 20, color: '#555', cursor: 'pointer', lineHeight: 1 }
