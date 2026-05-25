import { getPreviousDay, getNextDay, getToday, formatDate } from '../lib/dates'
import Button from './Button'

interface HeaderProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function Header({ selectedDate, onDateChange }: HeaderProps) {
  return (
    <header className="border-b border-border-subtle pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Daily Tracker</h1>
          <p className="text-text-muted mt-2">{formatDate(selectedDate)}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDateChange(getPreviousDay(selectedDate))}
          >
            ← Zurück
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDateChange(getToday())}
          >
            Heute
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDateChange(getNextDay(selectedDate))}
          >
            Voraus →
          </Button>
        </div>
      </div>
    </header>
  )
}
