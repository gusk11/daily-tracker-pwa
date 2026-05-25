import Card from './Card'
import Button from './Button'
import type { Task, Category } from '../lib/types'
import { getTasksByCategory, getTasksSortedByDueDate } from '../lib/calculations'
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

export default function TodoBoard({
  tasks,
  categories,
  selectedDate,
  onCompleteTask,
  onPostponeTask,
  onDeleteTask,
}: TodoBoardProps) {
  const categoryIds = [null, ...categories.map((c) => c.id)]

  const getPostponeStyle = (count: number) => {
    if (count === 0) return ''
    if (count === 1) return 'border-l-4 border-l-amber-500'
    return 'border-l-4 border-l-red-500'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Aufgaben</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categoryIds.map((catId) => {
          const categoryName = catId ? categories.find((c) => c.id === catId)?.name : 'Ohne Kategorie'
          const categoryTasks = getTasksByCategory(tasks, catId)
          const sortedTasks = getTasksSortedByDueDate(categoryTasks)

          if (sortedTasks.length === 0) return null

          return (
            <Card key={catId || 'no-cat'} className="space-y-3">
              <h3 className="font-bold text-text-primary">{categoryName}</h3>

              <div className="space-y-2">
                {sortedTasks.map((task) => {
                  const isOverdue = task.due_date && isPastDate(task.due_date) && !isToday(task.due_date)
                  const daysFromNow = task.due_date
                    ? task.due_date < selectedDate
                      ? 'überfällig'
                      : task.due_date === selectedDate
                        ? 'heute'
                        : 'bald'
                    : 'kein Datum'

                  return (
                    <div
                      key={task.id}
                      className={`p-3 bg-bg-primary rounded border border-border-subtle hover:border-accent-primary transition space-y-2 ${getPostponeStyle(task.postponed_count)}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium ${isOverdue ? 'text-accent-danger' : 'text-text-primary'}`}>
                            {task.title}
                          </p>
                          {task.note && <p className="text-text-muted text-sm mt-1">{task.note}</p>}
                          <div className="flex items-center gap-2 mt-2 text-xs text-text-muted flex-wrap">
                            {task.due_date && (
                              <span className={isOverdue ? 'text-accent-danger' : ''}>
                                📅 {daysFromNow}
                              </span>
                            )}
                            {task.estimated_minutes > 0 && <span>⏱ {task.estimated_minutes}min</span>}
                            {task.postponed_count > 0 && (
                              <span className={task.postponed_count >= 2 ? 'text-accent-danger' : 'text-accent-warning'}>
                                📌 {task.postponed_count}x postponed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onCompleteTask(task.id, selectedDate)}
                          className="text-xs"
                        >
                          ✓
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onPostponeTask(task.id)}
                          className="text-xs"
                        >
                          →
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteTask(task.id)}
                          className="text-xs"
                        >
                          🗑
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>

      {tasks.filter((t) => t.status === 'open').length === 0 && (
        <Card className="text-center py-8">
          <p className="text-text-muted">Alle Aufgaben erledigt! 🎉</p>
        </Card>
      )}
    </div>
  )
}
