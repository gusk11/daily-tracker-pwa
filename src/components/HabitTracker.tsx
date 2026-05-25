import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import Input from './Input'
import type { Habit, HabitCheck } from '../lib/types'

interface HabitTrackerProps {
  habits: Habit[]
  habitChecks: HabitCheck[]
  selectedDate: string
  onToggleCheck: (habitId: string, date: string) => void
  onAddHabit: (name: string, color: string) => void
  onDeleteHabit: (id: string) => void
  onUpdateHabit: (id: string, name: string, color: string) => void
}

export default function HabitTracker({
  habits,
  habitChecks,
  selectedDate,
  onToggleCheck,
  onAddHabit,
  onDeleteHabit,
}: HabitTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('blue')

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'cyan']

  const handleAdd = () => {
    if (name.trim()) {
      onAddHabit(name, color)
      setName('')
      setColor('blue')
      setShowForm(false)
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gewohnheiten</h2>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Abbrechen' : '+ Habit'}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-3 p-4 bg-bg-primary rounded-lg border border-border-subtle">
          <Input
            placeholder="Gewohnheit (z.B. Meditation)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Farbe</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-accent-primary' : ''}`}
                  style={{
                    backgroundColor:
                      {
                        red: '#ef4444',
                        blue: '#3b82f6',
                        green: '#22c55e',
                        yellow: '#eab308',
                        purple: '#a855f7',
                        pink: '#ec4899',
                        indigo: '#6366f1',
                        cyan: '#06b6d4',
                      }[c] || '#6b7280',
                  }}
                />
              ))}
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleAdd}>
            Hinzufügen
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map((habit) => {
          const isChecked = habitChecks.some(
            (c) => c.habit_id === habit.id && c.date === selectedDate && c.checked
          )

          return (
            <div
              key={habit.id}
              className="p-3 bg-bg-primary rounded-lg border border-border-subtle flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCheck(habit.id, selectedDate)}
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: habit.color }}
                />
                <span className={isChecked ? 'line-through text-text-muted' : 'text-text-primary'}>
                  {habit.name}
                </span>
              </div>
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="text-text-muted hover:text-accent-danger transition text-sm"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {habits.length === 0 && !showForm && (
        <p className="text-text-muted text-center py-4">Keine Gewohnheiten noch. Füge eine hinzu!</p>
      )}
    </Card>
  )
}
