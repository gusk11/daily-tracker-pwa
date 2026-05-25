import { useStore } from './hooks/useStore'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import HabitTracker from './components/HabitTracker'
import CategoryManager from './components/CategoryManager'
import TodoForm from './components/TodoForm'
import TodoBoard from './components/TodoBoard'
import CompletedTodos from './components/CompletedTodos'
import DailyReview from './components/DailyReview'
import WeeklyReview from './components/WeeklyReview'

export default function App() {
  const store = useStore()

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Header
          selectedDate={store.selectedDate}
          onDateChange={store.setSelectedDate}
        />

        <div className="mt-8 space-y-6">
          {/* Dashboard mit Statistiken */}
          <Dashboard
            tasks={store.tasks}
            habits={store.habits}
            habitChecks={store.habitChecks}
            selectedDate={store.selectedDate}
          />

          {/* Tagesrückblick */}
          <DailyReview
            selectedDate={store.selectedDate}
            review={store.getDailyReview(store.selectedDate)}
            onSaveReview={(date, review) => store.upsertDailyReview(date, review)}
          />

          {/* Wochenrückblick */}
          <WeeklyReview
            selectedDate={store.selectedDate}
            tasks={store.tasks}
            habits={store.habits}
            habitChecks={store.habitChecks}
            reviews={Array.from(store.reviews.values())}
          />

          {/* Aufgaben für heute */}
          <TodoBoard
            tasks={store.tasks}
            categories={store.categories}
            selectedDate={store.selectedDate}
            onCompleteTask={store.completeTask}
            onPostponeTask={store.postponeTask}
            onDeleteTask={store.deleteTask}
            onUpdateTask={store.updateTask}
          />

          {/* Erledigte Aufgaben */}
          <CompletedTodos
            tasks={store.tasks}
            categories={store.categories}
            selectedDate={store.selectedDate}
            onToggleTodo={(id) => {
              const task = store.tasks.find(t => t.id === id)
              if (task && task.status === 'done') {
                store.updateTask(id, { status: 'open' })
              }
            }}
          />

          {/* Komponenten hinzufügen (unten) */}
          <div className="space-y-6 mt-8 pt-6 border-t border-border-subtle">
            <HabitTracker
              habits={store.habits}
              habitChecks={store.habitChecks}
              selectedDate={store.selectedDate}
              onToggleCheck={store.toggleHabitCheck}
              onAddHabit={store.addHabit}
              onDeleteHabit={store.deleteHabit}
              onUpdateHabit={store.updateHabit}
            />

            <CategoryManager
              categories={store.categories}
              onAddCategory={store.addCategory}
              onDeleteCategory={store.deleteCategory}
              onUpdateCategory={store.updateCategory}
            />

            <TodoForm
              categories={store.categories}
              onAddTask={store.addTask}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
