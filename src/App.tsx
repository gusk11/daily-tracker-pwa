import { useState, type ReactElement } from 'react'
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

type Tab = 'heute' | 'rueckblick' | 'verwalten'

const TabToday = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const TabReview = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const TabManage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
  </svg>
)

const NAV_ITEMS: { id: Tab; label: string; Icon: () => ReactElement }[] = [
  { id: 'heute',      label: 'Heute',     Icon: TabToday  },
  { id: 'rueckblick', label: 'Rückblick', Icon: TabReview },
  { id: 'verwalten',  label: 'Verwalten', Icon: TabManage },
]

export default function App() {
  const store = useStore()
  const [tab, setTab] = useState<Tab>('heute')

  return (
    <div className="min-h-screen bg-[#071525] flex flex-col max-w-lg mx-auto">
      <Header selectedDate={store.selectedDate} onDateChange={store.setSelectedDate} />

      <main className="flex-1 overflow-y-auto pb-24">
        {tab === 'heute' && (
          <>
            <Dashboard
              tasks={store.tasks}
              habits={store.habits}
              habitChecks={store.habitChecks}
              categories={store.categories}
              selectedDate={store.selectedDate}
            />
            <div className="border-t border-[#1e3a52] my-2" />
            <HabitTracker
              habits={store.habits}
              habitChecks={store.habitChecks}
              selectedDate={store.selectedDate}
              onToggleCheck={store.toggleHabitCheck}
              onAddHabit={store.addHabit}
              onDeleteHabit={store.deleteHabit}
              onUpdateHabit={store.updateHabit}
            />
            <div className="border-t border-[#1e3a52] my-2" />
            <TodoBoard
              tasks={store.tasks}
              categories={store.categories}
              selectedDate={store.selectedDate}
              onCompleteTask={store.completeTask}
              onPostponeTask={store.postponeTask}
              onDeleteTask={store.deleteTask}
              onUpdateTask={store.updateTask}
            />
            <CompletedTodos
              tasks={store.tasks}
              categories={store.categories}
              selectedDate={store.selectedDate}
              onToggleTodo={id => {
                const task = store.tasks.find(t => t.id === id)
                if (task?.status === 'done') store.updateTask(id, { status: 'open' })
              }}
            />
          </>
        )}

        {tab === 'rueckblick' && (
          <>
            <DailyReview
              selectedDate={store.selectedDate}
              review={store.getDailyReview(store.selectedDate)}
              onSaveReview={(date, review) => store.upsertDailyReview(date, review)}
            />
            <div className="border-t border-[#1e3a52] my-2" />
            <WeeklyReview
              selectedDate={store.selectedDate}
              tasks={store.tasks}
              habits={store.habits}
              habitChecks={store.habitChecks}
              reviews={Array.from(store.reviews.values())}
            />
          </>
        )}

        {tab === 'verwalten' && (
          <>
            <TodoForm
              categories={store.categories}
              onAddTask={store.addTask}
            />
            <div className="border-t border-[#1e3a52] my-2" />
            <HabitTracker
              habits={store.habits}
              habitChecks={store.habitChecks}
              selectedDate={store.selectedDate}
              onToggleCheck={store.toggleHabitCheck}
              onAddHabit={store.addHabit}
              onDeleteHabit={store.deleteHabit}
              onUpdateHabit={store.updateHabit}
              manageMode
            />
            <div className="border-t border-[#1e3a52] my-2" />
            <CategoryManager
              categories={store.categories}
              onAddCategory={store.addCategory}
              onDeleteCategory={store.deleteCategory}
              onUpdateCategory={store.updateCategory}
            />
          </>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0d1f35] border-t border-[#1e3a52] safe-bottom">
        <div className="flex">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
              >
                <span style={{ color: active ? '#38bdf8' : '#64748b' }}>
                  <Icon />
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: active ? '#38bdf8' : '#64748b' }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
