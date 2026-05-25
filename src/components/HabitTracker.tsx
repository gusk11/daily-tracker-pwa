import { useState } from 'react'
import Button from './Button'
import type { Habit, HabitCheck } from '../lib/types'

interface HabitTrackerProps {
  habits: Habit[]
  habitChecks: HabitCheck[]
  selectedDate: string
  onToggleCheck: (habitId: string, date: string) => void
  onAddHabit: (name: string, color: string) => void
  onDeleteHabit: (id: string) => void
  onUpdateHabit: (id: string, name: string, color: string) => void
  manageMode?: boolean
}

const PALETTE = [
  { name: 'sky',    hex: '#38bdf8' },
  { name: 'green',  hex: '#22c55e' },
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'amber',  hex: '#f59e0b' },
  { name: 'rose',   hex: '#f43f5e' },
  { name: 'cyan',   hex: '#06b6d4' },
  { name: 'orange', hex: '#f97316' },
  { name: 'teal',   hex: '#14b8a6' },
  { name: 'lime',   hex: '#84cc16' },
]

export default function HabitTracker({
  habits,
  habitChecks,
  selectedDate,
  onToggleCheck,
  onAddHabit,
  onDeleteHabit,
  manageMode = false,
}: HabitTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PALETTE[0].hex)

  const handleAdd = () => {
    if (name.trim()) {
      onAddHabit(name.trim(), color)
      setName('')
      setColor(PALETTE[0].hex)
      setShowForm(false)
    }
  }

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#f1f5f9]">Gewohnheiten</h2>
        {manageMode && (
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Abbrechen' : '+ Hinzufügen'}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-4 mb-3 space-y-3">
          <input
            placeholder="Name der Gewohnheit"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-full bg-[#162d47] border border-[#1e3a52] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
            autoFocus
          />
          <div className="flex gap-2">
            {PALETTE.map(p => (
              <button
                key={p.name}
                onClick={() => setColor(p.hex)}
                className="w-7 h-7 rounded-full transition-transform"
                style={{
                  backgroundColor: p.hex,
                  transform: color === p.hex ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: color === p.hex ? `0 0 0 2px #0d1f35, 0 0 0 4px ${p.hex}` : 'none',
                }}
              />
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={handleAdd}>Speichern</Button>
        </div>
      )}

      <div className="space-y-2">
        {habits.map(habit => {
          const checked = habitChecks.some(hc => hc.habit_id === habit.id && hc.date === selectedDate && hc.checked)
          return (
            <div
              key={habit.id}
              className="flex items-center gap-3 bg-[#0d1f35] rounded-xl border px-4 py-3 transition-colors"
              style={{ borderColor: checked ? habit.color + '50' : '#1e3a52' }}
            >
              <button
                onClick={() => onToggleCheck(habit.id, selectedDate)}
                className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: checked ? habit.color : '#1e3a52',
                  backgroundColor: checked ? habit.color : 'transparent',
                }}
              >
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#071525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />

              <span className={`flex-1 text-sm font-medium transition-all ${checked ? 'line-through text-[#64748b]' : 'text-[#f1f5f9]'}`}>
                {habit.name}
              </span>

              {manageMode && (
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="text-[#1e3a52] hover:text-[#64748b] transition-colors ml-1 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
      </div>

      {habits.length === 0 && (
        <p className="text-center text-[#64748b] text-sm py-6">
          {manageMode ? 'Noch keine Gewohnheiten.' : 'Keine Gewohnheiten vorhanden. Im Tab "Verwalten" hinzufügen.'}
        </p>
      )}
    </div>
  )
}
