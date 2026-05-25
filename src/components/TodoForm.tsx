import { useState } from 'react'
import Button from './Button'
import type { Task, Category } from '../lib/types'

interface TodoFormProps {
  categories: Category[]
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
}

export default function TodoForm({ categories, onAddTask }: TodoFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const [title, setTitle]             = useState('')
  const [categoryId, setCategoryId]   = useState<string | null>(null)
  const [plannedDate, setPlannedDate] = useState(today)
  const [dueDate, setDueDate]         = useState('')
  const [minutes, setMinutes]         = useState(0)
  const [note, setNote]               = useState('')

  const handleSubmit = () => {
    if (!title.trim()) return
    onAddTask({
      category_id: categoryId,
      title: title.trim(),
      note: note || undefined,
      planned_date: plannedDate || undefined,
      due_date: dueDate || undefined,
      estimated_minutes: minutes,
      status: 'open',
      postponed_count: 0,
    })
    setTitle('')
    setCategoryId(null)
    setPlannedDate(today)
    setDueDate('')
    setMinutes(0)
    setNote('')
  }

  const inputCls = "w-full bg-[#162d47] border border-[#1e3a52] rounded-xl px-3 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b]/60 focus:outline-none focus:border-[#38bdf8] transition-colors"

  return (
    <div className="px-5 pb-5 space-y-4">
      <h2 className="text-base font-semibold text-[#f1f5f9]">Neue Aufgabe</h2>

      <input
        placeholder="Titel der Aufgabe *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        className={inputCls}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Kategorie</label>
          <select
            value={categoryId || ''}
            onChange={e => setCategoryId(e.target.value || null)}
            className={inputCls}
          >
            <option value="">Keine Kategorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Geplant für</label>
          <input
            type="date"
            value={plannedDate}
            onChange={e => setPlannedDate(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Fälligkeitsdatum (Deadline)</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Aufwand (Minuten)</label>
          <input
            type="number"
            min="0"
            max="480"
            value={minutes || ''}
            onChange={e => setMinutes(parseInt(e.target.value) || 0)}
            placeholder="0"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#64748b] mb-1.5 uppercase tracking-wide">Notiz</label>
        <textarea
          placeholder="Optional..."
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          className={inputCls + ' resize-none'}
        />
      </div>

      <Button variant="primary" size="md" onClick={handleSubmit} className="w-full justify-center">
        Aufgabe hinzufügen
      </Button>
    </div>
  )
}
