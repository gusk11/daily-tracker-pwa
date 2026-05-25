import Card from './Card'
import type { Task, Habit, HabitCheck } from '../lib/types'
import {
  getOpenTasksCount,
  getCompletedTasksForDate,
  getHabitCompletionRate,
  getTotalEstimatedMinutes,
} from '../lib/calculations'

interface StatCardsProps {
  tasks: Task[]
  habits: Habit[]
  habitChecks: HabitCheck[]
  selectedDate: string
}

export default function StatCards({
  tasks,
  habits,
  habitChecks,
  selectedDate,
}: StatCardsProps) {
  const openTasks = getOpenTasksCount(tasks)
  const completedToday = getCompletedTasksForDate(tasks, selectedDate)
  const habitQuote = getHabitCompletionRate(habits, habitChecks, selectedDate)
  const estimatedMinutes = getTotalEstimatedMinutes(tasks)

  const stats = [
    { label: 'Offene Tasks', value: openTasks },
    { label: 'Erledigt heute', value: completedToday },
    { label: 'Habit-Quote', value: habitQuote },
    { label: 'Aufwand (min)', value: estimatedMinutes },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-text-muted text-sm font-medium">{stat.label}</p>
          <p className="text-2xl font-bold text-accent-primary mt-2">{stat.value}</p>
        </Card>
      ))}
    </div>
  )
}
