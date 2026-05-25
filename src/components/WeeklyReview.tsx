import type { Task, Habit, HabitCheck, DailyReview } from '../lib/types'
import { getMonday, getSunday, formatDate } from '../lib/dates'
import { getWeekStats } from '../lib/calculations'

interface WeeklyReviewProps {
  selectedDate: string
  tasks: Task[]
  habits: Habit[]
  habitChecks: HabitCheck[]
  reviews: DailyReview[]
}

export default function WeeklyReview({
  selectedDate,
  tasks,
  habits,
  habitChecks,
  reviews,
}: WeeklyReviewProps) {
  const monday = getMonday(selectedDate)
  const sunday = getSunday(selectedDate)
  const stats = getWeekStats(tasks, habits, habitChecks, reviews, selectedDate)

  return (
    <div className="px-5 pb-5 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[#f1f5f9]">Wochenrückblick</h2>
        <p className="text-xs text-[#64748b] mt-0.5">{formatDate(monday)} – {formatDate(sunday)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3">
          <p className="text-xs text-[#64748b]">Erledigt</p>
          <p className="text-2xl font-bold text-[#22c55e]">{stats.completedThisWeek}</p>
        </div>
        <div className="bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3">
          <p className="text-xs text-[#64748b]">Noch offen</p>
          <p className="text-2xl font-bold text-[#38bdf8]">{stats.openTasksCount}</p>
        </div>
      </div>

      {habits.length > 0 && (
        <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-4 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">Habits diese Woche</p>
          <div className="space-y-3">
            {habits.map(habit => {
              const s = stats.habitStats[habit.id] || { completed: 0, total: 7 }
              const pct = Math.round((s.completed / s.total) * 100)
              return (
                <div key={habit.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#f1f5f9] font-medium">{habit.name}</span>
                    <span className="text-[#64748b]">{s.completed}/{s.total} Tage</span>
                  </div>
                  <div className="h-2 bg-[#162d47] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: habit.color || '#38bdf8' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {stats.mostPostponed.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">Oft verschoben</p>
          <div className="space-y-1.5">
            {stats.mostPostponed.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-2.5">
                <p className="text-sm text-[#f1f5f9] truncate">{task.title}</p>
                <span className="text-xs text-[#f97316] ml-3 flex-shrink-0">{task.postponed_count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.weekInsights.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">Tagesrückblicke</p>
          <div className="space-y-2">
            {stats.weekInsights.map((item, i) => (
              <div key={i} className="bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3 space-y-2.5">
                <p className="text-xs text-[#38bdf8] font-medium">{item.date}</p>
                {item.insight && (
                  <div>
                    <p className="text-xs text-[#64748b] uppercase tracking-wide mb-0.5">Erkenntnis</p>
                    <p className="text-sm text-[#f1f5f9]">{item.insight}</p>
                  </div>
                )}
                {item.question && (
                  <div>
                    <p className="text-xs text-[#64748b] uppercase tracking-wide mb-0.5">Offene Frage</p>
                    <p className="text-sm text-[#f1f5f9]">{item.question}</p>
                  </div>
                )}
                {item.brainDump && (
                  <div>
                    <p className="text-xs text-[#64748b] uppercase tracking-wide mb-0.5">Brain Dump</p>
                    <p className="text-sm text-[#f1f5f9] whitespace-pre-wrap">{item.brainDump}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
