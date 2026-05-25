import { formatDate, getPreviousDay, getNextDay, getToday } from '../lib/dates'

interface HeaderProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export default function Header({ selectedDate, onDateChange }: HeaderProps) {
  const isToday = selectedDate === getToday()

  return (
    <header className="px-5 pt-5 pb-4 border-b border-[#1e3a52]">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold text-[#f1f5f9] tracking-tight">Daily Tracker</h1>
        {!isToday && (
          <button
            onClick={() => onDateChange(getToday())}
            className="text-xs text-[#38bdf8] font-medium px-3 py-1 rounded-full bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 transition-colors"
          >
            Heute
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onDateChange(getPreviousDay(selectedDate))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#162d47] transition-all"
        >
          <ChevronLeft />
        </button>

        <div className="flex-1 text-center">
          <p className="text-[#64748b] text-sm font-medium">{formatDate(selectedDate)}</p>
        </div>

        <button
          onClick={() => onDateChange(getNextDay(selectedDate))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#162d47] transition-all"
        >
          <ChevronRight />
        </button>
      </div>
    </header>
  )
}
