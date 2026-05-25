import type { Task, Habit, HabitCheck, DailyReview } from './types'
import { getWeekDates, isPastDate } from './dates'

export const getOpenTasksCount = (tasks: Task[]): number => {
  return tasks.filter(t => t.status === 'open').length
}

export const getCompletedTasksForDate = (tasks: Task[], date: string): number => {
  return tasks.filter(t => t.status === 'done' && t.completed_date === date).length
}

export const getOverdueTasksCount = (tasks: Task[]): number => {
  return tasks.filter(
    t => t.status === 'open' && t.due_date && isPastDate(t.due_date)
  ).length
}

export const getTotalEstimatedMinutes = (tasks: Task[]): number => {
  return tasks
    .filter(t => t.status === 'open')
    .reduce((sum, t) => sum + (t.estimated_minutes || 0), 0)
}

export const getPostponedTasksCount = (tasks: Task[]): number => {
  return tasks.filter(t => t.status === 'open' && t.postponed_count > 0).length
}

export const getHabitCompletionRate = (
  habits: Habit[],
  habitChecks: HabitCheck[],
  date: string
): string => {
  if (habits.length === 0) return '0/0'

  const completed = habits.filter(h =>
    habitChecks.some(c => c.habit_id === h.id && c.date === date && c.checked)
  ).length

  return `${completed}/${habits.length}`
}

export const getTasksSortedByDueDate = (tasks: Task[]): Task[] => {
  const today = new Date().toISOString().split('T')[0]

  const overdue = tasks.filter(t => t.status === 'open' && t.due_date && t.due_date < today)
  const todayTasks = tasks.filter(t => t.status === 'open' && t.due_date === today)
  const future = tasks.filter(t => t.status === 'open' && t.due_date && t.due_date > today)
  const noDueDate = tasks.filter(t => t.status === 'open' && !t.due_date)

  return [...overdue, ...todayTasks, ...future, ...noDueDate]
}

export const getTasksByCategory = (tasks: Task[], categoryId: string | null): Task[] => {
  return tasks.filter(t => t.category_id === categoryId && t.status === 'open')
}

export const getWeekStats = (
  tasks: Task[],
  habits: Habit[],
  habitChecks: HabitCheck[],
  reviews: DailyReview[],
  dateStr: string
) => {
  const weekDates = getWeekDates(dateStr)
  const weekStart = weekDates[0]
  const weekEnd = weekDates[6]

  // Completed tasks this week
  const completedThisWeek = tasks.filter(
    t => t.status === 'done' && t.completed_date && t.completed_date >= weekStart && t.completed_date <= weekEnd
  ).length

  // Habit completion by day
  const habitStats: Record<string, { completed: number; total: number }> = {}

  for (const habit of habits) {
    let totalCompleted = 0
    let totalDays = 0

    for (const date of weekDates) {
      totalDays++
      const isChecked = habitChecks.some(c => c.habit_id === habit.id && c.date === date && c.checked)
      if (isChecked) totalCompleted++
    }

    habitStats[habit.id] = { completed: totalCompleted, total: totalDays }
  }

  // Insights and questions from week
  const weekInsights: { date: string; text: string }[] = []
  const weekQuestions: { date: string; text: string }[] = []
  const weekFocuses: { date: string; text: string }[] = []

  for (const review of reviews) {
    if (review.date >= weekStart && review.date <= weekEnd) {
      if (review.insight) weekInsights.push({ date: review.date, text: review.insight })
      if (review.question) weekQuestions.push({ date: review.date, text: review.question })
      if (review.tomorrow_focus) weekFocuses.push({ date: review.date, text: review.tomorrow_focus })
    }
  }

  // Most postponed open tasks
  const openTasks = tasks.filter(t => t.status === 'open')
  const mostPostponed = openTasks
    .filter(t => t.postponed_count > 0)
    .sort((a, b) => b.postponed_count - a.postponed_count)
    .slice(0, 5)

  return {
    completedThisWeek,
    habitStats,
    weekInsights,
    weekQuestions,
    weekFocuses,
    mostPostponed,
    openTasksCount: openTasks.length,
  }
}

export const sortTasksByPostponedCount = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => b.postponed_count - a.postponed_count)
}

export const getTasksForDate = (
  tasks: Task[],
  date: string,
  includeCompleted: boolean = false
): Task[] => {
  return tasks.filter(t => {
    if (!includeCompleted && t.status === 'done') return false

    if (t.due_date === date) return true
    if (t.due_date === undefined) return true

    return false
  })
}

export const getCompletedTasksForDateList = (tasks: Task[], date: string): Task[] => {
  return tasks.filter(t => t.status === 'done' && t.completed_date === date)
}
