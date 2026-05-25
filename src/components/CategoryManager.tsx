import { useState } from 'react'
import Button from './Button'
import type { Category } from '../lib/types'

interface CategoryManagerProps {
  categories: Category[]
  onAddCategory: (name: string, color: string) => void
  onDeleteCategory: (id: string) => void
  onUpdateCategory: (id: string, name: string, color: string) => void
}

const PALETTE = [
  '#38bdf8', '#22c55e', '#8b5cf6', '#f59e0b',
  '#f43f5e', '#06b6d4', '#6366f1', '#ec4899',
]

export default function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName]         = useState('')
  const [color, setColor]       = useState(PALETTE[0])

  const handleAdd = () => {
    if (name.trim()) {
      onAddCategory(name.trim(), color)
      setName('')
      setColor(PALETTE[0])
      setShowForm(false)
    }
  }

  return (
    <div className="px-5 pb-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#f1f5f9]">Kategorien</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Abbrechen' : '+ Hinzufügen'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-4 space-y-3">
          <input
            placeholder="Kategoriename"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-full bg-[#162d47] border border-[#1e3a52] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b]/60 focus:outline-none focus:border-[#38bdf8]"
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {PALETTE.map(p => (
              <button
                key={p}
                onClick={() => setColor(p)}
                className="w-7 h-7 rounded-full transition-transform"
                style={{
                  backgroundColor: p,
                  transform: color === p ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: color === p ? `0 0 0 2px #0d1f35, 0 0 0 4px ${p}` : 'none',
                }}
              />
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={handleAdd}>Speichern</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: cat.color + '18', color: cat.color, border: `1px solid ${cat.color}30` }}
          >
            <span>{cat.name}</span>
            <button
              onClick={() => onDeleteCategory(cat.id)}
              className="opacity-50 hover:opacity-100 transition-opacity text-sm leading-none ml-0.5"
            >
              ×
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-[#64748b]">Noch keine Kategorien.</p>
        )}
      </div>
    </div>
  )
}
