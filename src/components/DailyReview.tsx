import { useState, useEffect } from 'react'
import type { DailyReview as DailyReviewType } from '../lib/types'

interface DailyReviewProps {
  selectedDate: string
  review: DailyReviewType | undefined
  onSaveReview: (date: string, review: Partial<DailyReviewType>) => void
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  rows = 2,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#64748b] mb-1.5 uppercase tracking-wide">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full bg-[#162d47] border border-[#1e3a52] rounded-xl px-3 py-2.5 text-sm text-[#f1f5f9] placeholder-[#64748b]/60 focus:outline-none focus:border-[#38bdf8] resize-none transition-colors"
      />
    </div>
  )
}

export default function DailyReview({ selectedDate, review, onSaveReview }: DailyReviewProps) {
  const [insight, setInsight]     = useState('')
  const [question, setQuestion]   = useState('')
  const [brainDump, setBrainDump] = useState('')
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    setInsight(review?.insight || '')
    setQuestion(review?.question || '')
    setBrainDump(review?.brain_dump || '')
    setSaved(false)
  }, [selectedDate, review?.id])

  const handleSave = () => {
    onSaveReview(selectedDate, {
      insight:    insight.trim() || undefined,
      question:   question.trim() || undefined,
      brain_dump: brainDump.trim() || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const hasContent = insight.trim() || question.trim() || brainDump.trim()

  return (
    <div className="px-5 pb-5 space-y-4">
      <h2 className="text-base font-semibold text-[#f1f5f9]">Tagesrückblick</h2>

      <div className="space-y-3">
        <Field
          label="Erkenntnis von heute"
          placeholder="Was habe ich heute gelernt?"
          value={insight}
          onChange={e => setInsight(e.target.value)}
        />
        <Field
          label="Offene Fragen"
          placeholder="Was beschäftigt mich noch?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <Field
          label="Brain Dump"
          placeholder="Alles raus — Gedanken, Ideen, To-Dos..."
          value={brainDump}
          onChange={e => setBrainDump(e.target.value)}
          rows={4}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!hasContent}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={
          saved
            ? { backgroundColor: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40' }
            : hasContent
            ? { backgroundColor: '#38bdf820', color: '#38bdf8', border: '1px solid #38bdf840' }
            : { backgroundColor: '#162d47', color: '#64748b', border: '1px solid #1e3a52', cursor: 'not-allowed' }
        }
      >
        {saved ? '✓ Gespeichert & zum Wochenrückblick hinzugefügt' : 'Speichern'}
      </button>
    </div>
  )
}
