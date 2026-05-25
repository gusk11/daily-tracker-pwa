import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import type { Task, Category } from '../lib/types'

interface TodoFormProps {
  categories: Category[]
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
}

export default function TodoForm({ categories, onAddTask }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(0)
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask({
        category_id: categoryId,
        title,
        note: note || undefined,
        due_date: dueDate || undefined,
        estimated_minutes: estimatedMinutes,
        status: 'open',
        postponed_count: 0,
      })

      setTitle('')
      setCategoryId(null)
      setDueDate('')
      setEstimatedMinutes(0)
      setNote('')
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-bold">Neue Aufgabe</h2>

      <Input
        placeholder="Aufgabentitel *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Kategorie</label>
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="w-full px-4 py-2 bg-bg-secondary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary"
          >
            <option value="">Keine Kategorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          label="Fälligkeitsdatum"
        />

        <Input
          type="number"
          min="0"
          max="480"
          value={estimatedMinutes}
          onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
          label="Aufwand (Minuten)"
        />
      </div>

      <Textarea
        placeholder="Notiz (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
      />

      <Button variant="primary" onClick={handleSubmit}>
        Aufgabe Hinzufügen
      </Button>
    </Card>
  )
}
