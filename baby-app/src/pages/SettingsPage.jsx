import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../SettingsContext'

const COLORS = { play: '#F5A623', feed: '#6CC83A' }

function OptionList({ title, color, items, onAdd, onEdit, onDelete }) {
  const [newLabel, setNewLabel] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  function handleAdd() {
    const label = newLabel.trim()
    if (!label) return
    onAdd({ id: `opt_${Date.now()}`, label })
    setNewLabel('')
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditLabel(item.label)
  }

  function confirmEdit(item) {
    const label = editLabel.trim()
    if (label) onEdit({ ...item, label })
    setEditingId(null)
  }

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 16, fontWeight: 800, color, marginBottom: 12 }}>{title}</div>

      {items.map(item => (
        <div key={item.id} style={itemRowStyle}>
          {editingId === item.id ? (
            <>
              <input
                autoFocus
                value={editLabel}
                onChange={e => setEditLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmEdit(item)}
                style={inputStyle}
              />
              <button onClick={() => confirmEdit(item)} style={{ ...actionBtnStyle, color }}>저장</button>
              <button onClick={() => setEditingId(null)} style={grayBtnStyle}>취소</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#333' }}>{item.label}</span>
              <button onClick={() => startEdit(item)} style={{ ...actionBtnStyle, color }}>수정</button>
              <button onClick={() => onDelete(item.id)} style={{ ...actionBtnStyle, color: '#ff3b30' }}>삭제</button>
            </>
          )}
        </div>
      ))}

      {/* 추가 */}
      <div style={{ ...itemRowStyle, marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        <input
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="새 항목 이름"
          style={inputStyle}
        />
        <button onClick={handleAdd} style={{ ...actionBtnStyle, color: '#fff', background: color, border: 'none', padding: '8px 16px', borderRadius: 10 }}>
          추가
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { settings, saveSettings } = useSettings()
  const [birthDate, setBirthDate] = useState(settings.birthDate)

  function updatePlayOptions(next) {
    saveSettings({ ...settings, playOptions: next })
  }

  function updateFeedOptions(next) {
    saveSettings({ ...settings, feedOptions: next })
  }

  function saveBirthDate() {
    saveSettings({ ...settings, birthDate })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: 16, overflowY: 'auto' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 16, padding: '14px 20px', flexShrink: 0 }}>
        <button onClick={() => navigate('/')} style={navBtnStyle}>← 기록</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333' }}>설정</h2>
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        {/* 생년월일 */}
        <div style={{ ...cardStyle, flex: 1, alignSelf: 'flex-start' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#E91E8C', marginBottom: 12 }}>생년월일</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={saveBirthDate}
              style={{ padding: '10px 18px', border: 'none', borderRadius: 10, background: '#E91E8C', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              저장
            </button>
          </div>
        </div>

        {/* 놀이 옵션 */}
        <div style={{ flex: 1 }}>
          <OptionList
            title="놀이 항목"
            color={COLORS.play}
            items={settings.playOptions}
            onAdd={item => updatePlayOptions([...settings.playOptions, item])}
            onEdit={item => updatePlayOptions(settings.playOptions.map(o => o.id === item.id ? item : o))}
            onDelete={id => updatePlayOptions(settings.playOptions.filter(o => o.id !== id))}
          />
        </div>

        {/* 수유 옵션 */}
        <div style={{ flex: 1 }}>
          <OptionList
            title="수유량 항목"
            color={COLORS.feed}
            items={settings.feedOptions}
            onAdd={item => updateFeedOptions([...settings.feedOptions, item])}
            onEdit={item => updateFeedOptions(settings.feedOptions.map(o => o.id === item.id ? item : o))}
            onDelete={id => updateFeedOptions(settings.feedOptions.filter(o => o.id !== id))}
          />
        </div>
      </div>
    </div>
  )
}

const cardStyle      = { background: '#fff', borderRadius: 16, padding: 20 }
const itemRowStyle   = { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #f8f8f8' }
const inputStyle     = { flex: 1, padding: '8px 12px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, color: '#333', outline: 'none' }
const actionBtnStyle = { padding: '6px 12px', border: '1.5px solid currentColor', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#fff', cursor: 'pointer' }
const grayBtnStyle   = { padding: '6px 12px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#aaa', background: '#fff', cursor: 'pointer' }
const navBtnStyle    = { padding: '8px 16px', border: 'none', borderRadius: 12, background: '#f0f2f5', color: '#555', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
