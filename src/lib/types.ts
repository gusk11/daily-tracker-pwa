export interface Category {
  id: string
  name: string
  color: string
}

export interface Habit {
  id: string
  name: string
  color: string
  is_active: boolean
}

export interface HabitCheck {
  id: string
  habit_id: string
  date: string // YYYY-MM-DD
  checked: boolean
}

export interface Task {
  id: string
  category_id: string | null
  title: string
  note?: string
  due_date?: string // YYYY-MM-DD
  estimated_minutes: number
  status: 'open' | 'done'
  postponed_count: number
  last_postponed_at?: string
  completed_at?: string
  completed_date?: string // YYYY-MM-DD
  created_at: string
  updated_at: string
}

export interface DailyReview {
  id: string
  date: string // YYYY-MM-DD
  progress?: string
  insight?: string
  question?: string
  tomorrow_focus?: string
  good?: string
  bad?: string
  brain_dump?: string
  created_at: string
  updated_at: string
}

export interface StoreState {
  habits: Habit[]
  categories: Category[]
  tasks: Task[]
  habitChecks: HabitCheck[]
  reviews: Map<string, DailyReview>
  selectedDate: string
}

export interface StoreActions {
  // Habits
  addHabit: (name: string, color: string) => void
  deleteHabit: (id: string) => void
  toggleHabitStatus: (id: string) => void
  updateHabit: (id: string, name: string, color: string) => void

  // Habit Checks
  toggleHabitCheck: (habitId: string, date: string) => void
  getHabitCheckForDate: (habitId: string, date: string) => boolean

  // Categories
  addCategory: (name: string, color: string) => void
  deleteCategory: (id: string) => void
  updateCategory: (id: string, name: string, color: string) => void

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string, date: string) => void
  postponeTask: (id: string) => void

  // Reviews
  upsertDailyReview: (date: string, review: Partial<DailyReview>) => void
  getDailyReview: (date: string) => DailyReview | undefined

  // Date Navigation
  setSelectedDate: (date: string) => void

  // Export/Import
  exportData: () => string
  importData: (json: string) => boolean
}
