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
        <div className="space-y-3 p-5 bg-gradient-to-br from-bg-primary to-bg-secondary rounded-xl border border-border-subtle shadow-md">
          <Input
            placeholder="Gewohnheit (z.B. Meditation)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">Farbe wählen</label>
            <div className="flex gap-3 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110 ${color === c ? 'ring-3 ring-accent scale-110' : 'hover:shadow-lg'}`}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => {
          const isChecked = habitChecks.some(
            (c) => c.habit_id === habit.id && c.date === selectedDate && c.checked
          )

          return (
            <div
              key={habit.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between shadow-md hover:shadow-lg ${
                isChecked
                  ? 'bg-gradient-to-r from-success/10 to-success/5 border-success'
                  : 'bg-gradient-to-br from-bg-primary to-bg-secondary border-border-subtle hover:border-accent'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCheck(habit.id, selectedDate)}
                  className="w-6 h-6 rounded-lg cursor-pointer"
                  style={{ accentColor: habit.color }}
                />
                <span className={`font-medium transition-all ${isChecked ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                  {habit.name}
                </span>
              </div>
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="text-text-muted hover:text-accent-danger transition duration-200 text-lg hover:scale-125"
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
