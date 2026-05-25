import { useMemo } from 'react'
import type { Task, Habit, HabitCheck, Category } from '../lib/types'
import { toDateString } from '../lib/dates'

interface DashboardProps {
  tasks: Task[]
  habits: Habit[]
  habitChecks: HabitCheck[]
  categories: Category[]
  selectedDate: string | Date
}

interface RingProps {
  percentage: number
  color: string
  size?: number
}

function Ring({ percentage, color, size = 72 }: RingProps) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(percentage, 100) / 100)

  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#1e3a52" strokeWidth="6" />
      <circle
        cx="32" cy="32" r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

export default function Dashboard({
  tasks,
  habits,
  habitChecks,
  categories,
  selectedDate,
}: DashboardProps) {
  const selectedDateStr = typeof selectedDate === 'string'
    ? selectedDate
    : toDateString(selectedDate)

  const todayTasks = useMemo(() => {
    const plannedToday = tasks.filter(t => {
      if (t.status === 'done') return t.completed_date === selectedDateStr
      if (t.planned_date) return t.planned_date === selectedDateStr
      return !t.due_date || t.due_date === selectedDateStr
    })
    return plannedToday
  }, [tasks, selectedDateStr])

  const taskStats = useMemo(() => {
    const done = todayTasks.filter(t => t.status === 'done').length
    const total = todayTasks.length || 1
    return { done, total: todayTasks.length, percentage: Math.round((done / total) * 100) }
  }, [todayTasks])

  const habitStats = useMemo(() => {
    const done = habitChecks.filter(hc => hc.date === selectedDateStr).length
    const total = habits.filter(h => h.is_active).length || 1
    return { done, total: habits.filter(h => h.is_active).length, percentage: Math.round((done / total) * 100) }
  }, [habitChecks, habits, selectedDateStr])

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    todayTasks.filter(t => t.status === 'open').forEach(task => {
      const cat = categories.find(c => c.id === task.category_id)?.name ?? 'Sonstiges'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  }, [todayTasks, categories])

  const openCount = todayTasks.filter(t => t.status === 'open').length
  const estimatedMin = todayTasks.filter(t => t.status === 'open').reduce((s, t) => s + (t.estimated_minutes || 0), 0)

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Progress rings */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-4 flex items-center gap-4">
          <Ring percentage={taskStats.percentage} color="#38bdf8" />
          <div>
            <p className="text-[#64748b] text-xs font-medium uppercase tracking-wide">Aufgaben</p>
            <p className="text-2xl font-bold text-[#f1f5f9] mt-0.5">{taskStats.percentage}%</p>
            <p className="text-[#64748b] text-xs mt-0.5">{taskStats.done}/{taskStats.total}</p>
          </div>
        </div>

        <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-4 flex items-center gap-4">
          <Ring percentage={habitStats.percentage} color="#22c55e" />
          <div>
            <p className="text-[#64748b] text-xs font-medium uppercase tracking-wide">Habits</p>
            <p className="text-2xl font-bold text-[#f1f5f9] mt-0.5">{habitStats.percentage}%</p>
            <p className="text-[#64748b] text-xs mt-0.5">{habitStats.done}/{habitStats.total}</p>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3">
          <p className="text-[#64748b] text-xs">Offene Tasks</p>
          <p className="text-xl font-bold text-[#38bdf8]">{openCount}</p>
        </div>
        <div className="bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3">
          <p className="text-[#64748b] text-xs">Geschätzter Aufwand</p>
          <p className="text-xl font-bold text-[#f97316]">{estimatedMin > 0 ? `${estimatedMin} min` : '—'}</p>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a52] p-4">
          <p className="text-[#64748b] text-xs font-medium uppercase tracking-wide mb-3">Nach Kategorie</p>
          <div className="space-y-2.5">
            {categoryBreakdown.map(([name, count]) => {
              const maxCount = categoryBreakdown[0][1]
              return (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#f1f5f9]">{name}</span>
                    <span className="text-[#64748b]">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#1e3a52] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#38bdf8] transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
