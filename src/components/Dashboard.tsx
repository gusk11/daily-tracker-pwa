import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import type { Task, Habit, HabitCheck, Category } from '../lib/types'
import { toDateString } from '../lib/dates'

interface DashboardProps {
  tasks: Task[]
  habits: Habit[]
  habitChecks: HabitCheck[]
  categories: Category[]
  selectedDate: string | Date
}

export default function Dashboard({
  tasks,
  habits,
  habitChecks,
  categories,
  selectedDate
}: DashboardProps) {
  const selectedDateStr = typeof selectedDate === 'string'
    ? selectedDate
    : toDateString(selectedDate)

  const taskStats = useMemo(() => {
    const done = tasks.filter(t => t.status === 'done').length
    const total = tasks.length || 1
    return { done, total, percentage: Math.round((done / total) * 100) }
  }, [tasks])

  const habitStats = useMemo(() => {
    const done = habitChecks.filter(hc => hc.date === selectedDateStr).length
    const total = habits.length || 1
    return { done, total, percentage: Math.round((done / total) * 100) }
  }, [habitChecks, habits, selectedDateStr])

  const weeklyHabitData = useMemo(() => {
    const selectedDateObj = typeof selectedDate === 'string'
      ? new Date(selectedDate + 'T00:00:00')
      : selectedDate
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date(selectedDateObj.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = toDateString(day)
      const count = habitChecks.filter(hc => hc.date === dateStr).length
      dates.push({
        date: day.toLocaleDateString('de-DE', { weekday: 'short' }),
        Gewohnheiten: count
      })
    }
    return dates
  }, [habitChecks, selectedDate, selectedDateStr])

  const taskCategoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach(task => {
      const cat = categories.find(c => c.id === task.category_id)?.name ?? 'Sonstiges'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [tasks, categories])

  const COLORS = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6">
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Completion */}
        <div className="bg-gradient-to-br from-bg-secondary to-bg-primary rounded-2xl p-6 border border-border-subtle shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Aufgaben heute</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-4xl font-bold text-accent mb-2">{taskStats.percentage}%</div>
              <div className="text-sm text-text-secondary">{taskStats.done} von {taskStats.total} erledigt</div>
            </div>
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Erledigt', value: taskStats.done },
                      { name: 'Offen', value: Math.max(0, taskStats.total - taskStats.done) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                  >
                    <Cell fill="#38bdf8" />
                    <Cell fill="#10243d" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Habit Completion */}
        <div className="bg-gradient-to-br from-bg-secondary to-bg-primary rounded-2xl p-6 border border-border-subtle shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Gewohnheiten heute</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-4xl font-bold text-success mb-2">{habitStats.percentage}%</div>
              <div className="text-sm text-text-secondary">{habitStats.done} von {habitStats.total} abgehakt</div>
            </div>
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Erledigt', value: habitStats.done },
                      { name: 'Offen', value: Math.max(0, habitStats.total - habitStats.done) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#10243d" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Wöchlicher Überblick */}
      <div className="bg-gradient-to-br from-bg-secondary to-bg-primary rounded-2xl p-6 border border-border-subtle shadow-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Wöchentlicher Fortschritt</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyHabitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#38bdf8" opacity={0.2} />
            <XAxis dataKey="date" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip
              contentStyle={{ backgroundColor: '#10243d', border: '1px solid #38bdf8', borderRadius: '8px' }}
              labelStyle={{ color: '#38bdf8' }}
            />
            <Bar dataKey="Gewohnheiten" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Aufgaben nach Kategorie */}
      {taskCategoryData.length > 0 && (
        <div className="bg-gradient-to-br from-bg-secondary to-bg-primary rounded-2xl p-6 border border-border-subtle shadow-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Aufgaben nach Kategorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#10243d', border: '1px solid #38bdf8', borderRadius: '8px' }}
                labelStyle={{ color: '#38bdf8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
