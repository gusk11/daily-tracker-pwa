import type { Task, Category } from '../lib/types'
import { getCompletedTasksForDateList } from '../lib/calculations'

interface CompletedTodosProps {
  tasks: Task[]
  categories: Category[]
  selectedDate: string
  onToggleTodo: (id: string) => void
}

export default function CompletedTodos({
  tasks,
  categories,
  selectedDate,
  onToggleTodo,
}: CompletedTodosProps) {
  const completedTasks = getCompletedTasksForDateList(tasks, selectedDate)
  if (completedTasks.length === 0) return null

  return (
    <div className="px-5 pb-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#64748b] mb-3">
        Erledigt heute · {completedTasks.length}
      </p>
      <div className="space-y-1.5">
        {completedTasks.map(task => {
          const category = task.category_id ? categories.find(c => c.id === task.category_id) : null
          return (
            <div
              key={task.id}
              className="flex items-center justify-between bg-[#0d1f35] rounded-xl border border-[#22c55e]/20 px-4 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#64748b] line-through truncate">{task.title}</p>
                  {category && <p className="text-xs text-[#1e3a52] truncate">{category.name}</p>}
                </div>
              </div>
              <button
                onClick={() => onToggleTodo(task.id)}
                className="text-xs text-[#64748b] hover:text-[#f1f5f9] ml-3 flex-shrink-0 transition-colors"
              >
                Rückgängig
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
