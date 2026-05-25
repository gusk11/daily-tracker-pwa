import { useState, useEffect } from 'react'
import type { DailyReview as DailyReviewType } from '../lib/types'
import { debounce } from '../lib/utils'

interface DailyReviewProps {
  selectedDate: string
  review: DailyReviewType | undefined
  onSaveReview: (date: string, review: Partial<DailyReviewType>) => void
}

interface FieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  className?: string
}

function Field({ label, placeholder, value, onChange, rows = 2, className = '' }: FieldProps) {
  return (
    <div className={className}>
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

export default function DailyReview({
  selectedDate,
  review,
  onSaveReview,
}: DailyReviewProps) {
  const [insight, setInsight]     = useState('')
  const [question, setQuestion]   = useState('')
  const [brainDump, setBrainDump] = useState('')
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    setInsight(review?.insight || '')
    setQuestion(review?.question || '')
    setBrainDump(review?.brain_dump || '')
  }, [selectedDate, review])

  const saveReview = debounce(() => {
    onSaveReview(selectedDate, {
      insight:    insight || undefined,
      question:   question || undefined,
      brain_dump: brainDump || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, 1000)

  const handle = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value)
    saveReview()
  }

  return (
    <div className="px-5 pb-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#f1f5f9]">Tagesrückblick</h2>
        {saved && <span className="text-xs text-[#22c55e]">Gespeichert</span>}
      </div>

      <div className="space-y-3">
        <Field label="Erkenntnis von heute" placeholder="Was habe ich heute gelernt?" value={insight} onChange={handle(setInsight)} />
        <Field label="Offene Fragen" placeholder="Was beschäftigt mich noch?" value={question} onChange={handle(setQuestion)} />
        <Field label="Brain Dump" placeholder="Alles raus — Gedanken, Ideen, To-Dos..." value={brainDump} onChange={handle(setBrainDump)} rows={4} />
      </div>
    </div>
  )
}
