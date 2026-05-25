import { useState, useEffect } from 'react'
import Card from './Card'
import Textarea from './Textarea'
import type { DailyReview as DailyReviewType } from '../lib/types'
import { debounce } from '../lib/utils'

interface DailyReviewProps {
  selectedDate: string
  review: DailyReviewType | undefined
  onSaveReview: (date: string, review: Partial<DailyReviewType>) => void
}

export default function DailyReview({
  selectedDate,
  review,
  onSaveReview,
}: DailyReviewProps) {
  const [progress, setProgress] = useState('')
  const [insight, setInsight] = useState('')
  const [question, setQuestion] = useState('')
  const [tomorrowFocus, setTomorrowFocus] = useState('')
  const [good, setGood] = useState('')
  const [bad, setBad] = useState('')
  const [brainDump, setBrainDump] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (review) {
      setProgress(review.progress || '')
      setInsight(review.insight || '')
      setQuestion(review.question || '')
      setTomorrowFocus(review.tomorrow_focus || '')
      setGood(review.good || '')
      setBad(review.bad || '')
      setBrainDump(review.brain_dump || '')
    } else {
      setProgress('')
      setInsight('')
      setQuestion('')
      setTomorrowFocus('')
      setGood('')
      setBad('')
      setBrainDump('')
    }
  }, [selectedDate, review])

  const saveReview = debounce(() => {
    onSaveReview(selectedDate, {
      progress: progress || undefined,
      insight: insight || undefined,
      question: question || undefined,
      tomorrow_focus: tomorrowFocus || undefined,
      good: good || undefined,
      bad: bad || undefined,
      brain_dump: brainDump || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, 1000)

  const handleChange = (setter: any) => (e: any) => {
    setter(e.target.value)
    saveReview()
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tagesrückblick</h2>
        {saved && <p className="text-accent-success text-sm">✓ Gespeichert</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Textarea
          placeholder="Wichtigster Fortschritt..."
          value={progress}
          onChange={handleChange(setProgress)}
          rows={3}
        />

        <Textarea
          placeholder="Erkenntnis des Tages..."
          value={insight}
          onChange={handleChange(setInsight)}
          rows={3}
        />

        <Textarea
          placeholder="Offene Frage..."
          value={question}
          onChange={handleChange(setQuestion)}
          rows={3}
        />

        <Textarea
          placeholder="Morgen-Fokus..."
          value={tomorrowFocus}
          onChange={handleChange(setTomorrowFocus)}
          rows={3}
        />

        <Textarea
          placeholder="Was lief gut?"
          value={good}
          onChange={handleChange(setGood)}
          rows={3}
        />

        <Textarea
          placeholder="Was lief nicht gut?"
          value={bad}
          onChange={handleChange(setBad)}
          rows={3}
        />

        <Textarea
          placeholder="Brain Dump (alles notieren)..."
          value={brainDump}
          onChange={handleChange(setBrainDump)}
          rows={3}
          className="lg:col-span-2"
        />
      </div>
    </Card>
  )
}
