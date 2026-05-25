import type { Task, Category } from '../lib/types'
import { getTasksSortedByDueDate } from '../lib/calculations'
import { isPastDate, isToday } from '../lib/dates'

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

export default function TodoBoard({
  tasks,
  categories,
  selectedDate,
  onCompleteTask,
  onPostponeTask,
  onDeleteTask,
}: TodoBoardProps) {
  const openTasks = tasks.filter(t => t.status === 'open')
  const sortedTasks = getTasksSortedByDueDate(openTasks)

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#f1f5f9]">Aufgaben</h2>
        {openTasks.length > 0 && (
          <span className="text-xs text-[#64748b] bg-[#162d47] px-2.5 py-0.5 rounded-full">
            {openTasks.length} offen
          </span>
        )}
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-8 text-[#64748b] text-sm">
          Alle Aufgaben erledigt
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map(task => {
            const isOverdue = task.due_date && isPastDate(task.due_date) && !isToday(task.due_date)
            const category = task.category_id ? categories.find(c => c.id === task.category_id) : null
            const isWarnPostpone = task.postponed_count >= 2

            return (
              <div
                key={task.id}
                className="bg-[#0d1f35] rounded-xl border border-[#1e3a52] px-4 py-3"
                style={isWarnPostpone ? { borderLeftColor: '#ef4444', borderLeftWidth: 3 } : undefined}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug truncate ${isOverdue ? 'text-[#ef4444]' : 'text-[#f1f5f9]'}`}>
                      {task.title}
                    </p>
                    {task.note && <p className="text-xs text-[#64748b] mt-0.5 truncate">{task.note}</p>}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {category && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: (category.color || '#38bdf8') + '20', color: category.color || '#38bdf8' }}
                        >
                          {category.name}
                        </span>
                      )}
                      {task.due_date && (
                        <span className={`text-xs ${isOverdue ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
                          {isOverdue ? 'Überfällig' : task.due_date === selectedDate ? 'Heute' : 'Bald'}
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
                    onClick={() => onCompleteTask(task.id, selectedDate)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-xs font-medium hover:bg-[#22c55e]/20 transition-colors"
                  >
                    <CheckIcon /> Erledigt
                  </button>
                  <button
                    onClick={() => onPostponeTask(task.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162d47] text-[#64748b] border border-[#1e3a52] text-xs font-medium hover:text-[#f1f5f9] transition-colors"
                  >
                    <ArrowIcon /> Verschieben
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 text-xs font-medium hover:bg-[#ef4444]/20 transition-colors ml-auto"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
