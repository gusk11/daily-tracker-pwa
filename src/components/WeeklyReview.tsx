import Card from './Card'
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
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Wochenrückblick</h2>
        <p className="text-text-muted text-sm mt-1">
          {formatDate(monday)} – {formatDate(sunday)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-bg-primary rounded border border-border-subtle">
          <p className="text-text-muted text-sm">Erledigte Tasks</p>
          <p className="text-2xl font-bold text-accent-success">{stats.completedThisWeek}</p>
        </div>

        <div className="p-3 bg-bg-primary rounded border border-border-subtle">
          <p className="text-text-muted text-sm">Offene Tasks</p>
          <p className="text-2xl font-bold text-accent-primary">{stats.openTasksCount}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-text-primary">Gewohnheiten diese Woche</h3>
        <div className="space-y-2">
          {habits.map((habit) => {
            const stat = stats.habitStats[habit.id] || { completed: 0, total: 7 }
            const percentage = Math.round((stat.completed / stat.total) * 100)

            return (
              <div key={habit.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-primary">{habit.name}</span>
                  <span className="text-text-muted text-sm">
                    {stat.completed}/{stat.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: habit.color || '#38bdf8',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {stats.mostPostponed.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-text-primary">Meist verschoben</h3>
          <div className="space-y-2">
            {stats.mostPostponed.slice(0, 3).map((task) => (
              <div key={task.id} className="p-2 bg-bg-primary rounded text-sm">
                <p className="text-text-primary">{task.title}</p>
                <p className="text-accent-warning">📌 {task.postponed_count}x postponed</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.weekInsights.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-text-primary">Erkenntnisse der Woche</h3>
          <div className="space-y-2">
            {stats.weekInsights.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-bg-primary rounded">
                <p className="text-text-muted text-xs mb-1">{item.date}</p>
                <p className="text-text-primary">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.weekQuestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-text-primary">Offene Fragen</h3>
          <div className="space-y-2">
            {stats.weekQuestions.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-bg-primary rounded">
                <p className="text-text-primary">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
