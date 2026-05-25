import type { Task, Category } from '../lib/types'
import { getMonday, getSunday, getToday } from '../lib/dates'

interface TodoBoardProps {
  tasks: Task[]
  categories: Category[]
  selectedDate: string
  onCompleteTask: (id: string, date: string) => void
  onPostponeTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onUpdateTask: (id: string, task: Partial<Task>) => void
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 3h12M5 3V2h4v1M3 3l1 9h6l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface TaskCardProps {
  task: Task
  categories: Category[]
  onComplete: () => void
  onPostpone: () => void
  onDelete: () => void
  dimmed?: boolean
}

function TaskCard({ task, categories, onComplete, onPostpone, onDelete, dimmed }: TaskCardProps) {
  const category = task.category_id ? categories.find(c => c.id === task.category_id) : null
  const today = getToday()
  const isOverdue = task.due_date && task.due_date < today
  const isDueToday = task.due_date === today
  const isDueSoon = task.due_date && task.due_date > today
  const isWarnPostpone = task.postponed_count >= 2

  return (
    <div
      className={`bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3 transition-opacity ${dimmed ? 'opacity-60' : ''}`}
      style={isWarnPostpone ? { borderLeftColor: '#ef4444', borderLeftWidth: 3 } : undefined}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#f1f5f9] leading-snug">{task.title}</p>
          {task.note && <p className="text-xs text-[#64748b] mt-0.5 truncate">{task.note}</p>}

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {category && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: (category.color || '#38bdf8') + '20', color: category.color || '#38bdf8' }}
              >
                {category.name}
              </span>
            )}
            {task.due_date && (
              <span className={`text-xs font-medium ${isOverdue ? 'text-[#ef4444]' : isDueToday ? 'text-[#f97316]' : isDueSoon ? 'text-[#64748b]' : ''}`}>
                {isOverdue ? `Fällig: ${task.due_date}` : isDueToday ? 'Deadline: heute' : `Deadline: ${task.due_date}`}
              </span>
            )}
            {task.estimated_minutes > 0 && (
              <span className="text-xs text-[#64748b]">{task.estimated_minutes} min</span>
            )}
            {task.postponed_count > 0 && (
              <span className={`text-xs ${isWarnPostpone ? 'text-[#ef4444]' : 'text-[#f97316]'}`}>
                {task.postponed_count}× verschoben
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mt-3">
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-xs font-medium hover:bg-[#22c55e]/20 transition-colors"
        >
          <CheckIcon /> Erledigt
        </button>
        <button
          onClick={onPostpone}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162d47] text-[#64748b] border border-[#1e3a52] text-xs font-medium hover:text-[#f1f5f9] transition-colors"
        >
          <ArrowIcon /> Verschieben
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 text-xs font-medium hover:bg-[#ef4444]/20 transition-colors ml-auto"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

export default function TodoBoard({
  tasks,
  categories,
  selectedDate,
  onCompleteTask,
  onPostponeTask,
  onDeleteTask,
}: TodoBoardProps) {
  const weekStart = getMonday(selectedDate)
  const weekEnd = getSunday(selectedDate)

  const openTasks = tasks.filter(t => t.status === 'open')

  // Tasks planned for selected date (or overdue planned tasks shown on today)
  const todayTasks = openTasks.filter(t => {
    if (t.planned_date) return t.planned_date === selectedDate
    // Legacy tasks without planned_date: show if due_date matches or no due_date set
    return !t.due_date || t.due_date === selectedDate
  })

  // Tasks planned for this week (but not today)
  const weekTasks = openTasks.filter(t => {
    if (todayTasks.includes(t)) return false
    if (!t.planned_date) return false
    return t.planned_date > selectedDate && t.planned_date >= weekStart && t.planned_date <= weekEnd
  })

  return (
    <div className="px-5 pb-4 space-y-5">
      {/* Today's tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#f1f5f9]">Heutige Aufgaben</h2>
          {todayTasks.length > 0 && (
            <span className="text-xs text-[#64748b] bg-[#162d47] px-2.5 py-0.5 rounded-full">
              {todayTasks.length}
            </span>
          )}
        </div>

        {todayTasks.length === 0 ? (
          <p className="text-sm text-[#64748b] py-4 text-center">Keine Aufgaben für heute geplant.</p>
        ) : (
          <div className="space-y-2">
            {todayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
                onComplete={() => onCompleteTask(task.id, selectedDate)}
                onPostpone={() => onPostponeTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* This week's tasks */}
      {weekTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wide">Diese Woche</h2>
            <span className="text-xs text-[#64748b] bg-[#162d47] px-2.5 py-0.5 rounded-full">
              {weekTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {weekTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
                onComplete={() => onCompleteTask(task.id, selectedDate)}
                onPostpone={() => onPostponeTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                dimmed
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
