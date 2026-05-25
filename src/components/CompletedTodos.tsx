import Card from './Card'
import Button from './Button'
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
    <Card className="space-y-3">
      <h3 className="font-bold text-accent-success">Erledigt am {selectedDate}</h3>

      <div className="space-y-2">
        {completedTasks.map((task) => {
          const category = task.category_id ? categories.find((c) => c.id === task.category_id) : null

          return (
            <div key={task.id} className="flex items-center justify-between p-2 bg-bg-primary rounded border border-accent-success/30">
              <div className="flex-1">
                <p className="line-through text-text-muted">{task.title}</p>
                {category && <p className="text-xs text-text-muted">{category.name}</p>}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onToggleTodo(task.id)}
                className="text-xs"
              >
                Rückgängig
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
