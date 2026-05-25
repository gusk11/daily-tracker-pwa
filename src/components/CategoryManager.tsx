import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import Input from './Input'
import type { Category } from '../lib/types'

interface CategoryManagerProps {
  categories: Category[]
  onAddCategory: (name: string, color: string) => void
  onDeleteCategory: (id: string) => void
  onUpdateCategory: (id: string, name: string, color: string) => void
}

export default function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('blue')

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'cyan']

  const handleAdd = () => {
    if (name.trim()) {
      onAddCategory(name, color)
      setName('')
      setColor('blue')
      setShowForm(false)
    }
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-text-primary">Kategorien</h3>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Abbrechen' : '+ Kategorie'}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-2 p-3 bg-bg-primary rounded border border-border-subtle">
          <Input
            placeholder="Kategoriename"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-all ${color === c ? 'ring-2 ring-accent-primary' : ''}`}
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
          <Button variant="primary" size="sm" onClick={handleAdd}>
            Hinzufügen
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: cat.color + '20', borderLeft: `3px solid ${cat.color}` }}
          >
            <span className="text-text-primary">{cat.name}</span>
            <button
              onClick={() => onDeleteCategory(cat.id)}
              className="text-text-muted hover:text-accent-danger transition ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
