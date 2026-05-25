import type { Task, DailyReview, Habit, HabitCheck, Category } from './types'

const STORAGE_KEYS = {
  HABITS: 'daily-tracker-habits',
  CATEGORIES: 'daily-tracker-categories',
  SELECTED_DATE: 'daily-tracker-selected-date',
  DB_VERSION: 'daily-tracker-db-version',
}

const DB_NAME = 'daily-tracker-db'
const DB_VERSION = 1

let db: IDBDatabase | null = null

// IndexedDB Setup
export const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Tasks Store
      if (!database.objectStoreNames.contains('tasks')) {
        const tasksStore = database.createObjectStore('tasks', { keyPath: 'id' })
        tasksStore.createIndex('status', 'status')
        tasksStore.createIndex('due_date', 'due_date')
        tasksStore.createIndex('completed_date', 'completed_date')
      }

      // Reviews Store
      if (!database.objectStoreNames.contains('reviews')) {
        database.createObjectStore('reviews', { keyPath: 'date' })
      }

      // Habit Checks Store
      if (!database.objectStoreNames.contains('habitChecks')) {
        const checksStore = database.createObjectStore('habitChecks', { keyPath: 'id' })
        checksStore.createIndex('habit_id_date', ['habit_id', 'date'], { unique: true })
      }
    }
  })
}

const getDB = async (): Promise<IDBDatabase> => {
  if (db) return db
  return initDB()
}

// localStorage: Habits
export const saveHabits = (habits: Habit[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
  } catch (e) {
    console.error('Error saving habits:', e)
  }
}

export const loadHabits = (): Habit[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error loading habits:', e)
    return []
  }
}

// localStorage: Categories
export const saveCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  } catch (e) {
    console.error('Error saving categories:', e)
  }
}

export const loadCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error loading categories:', e)
    return []
  }
}

// localStorage: Selected Date
export const saveSelectedDate = (date: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, date)
  } catch (e) {
    console.error('Error saving selected date:', e)
  }
}

export const loadSelectedDate = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_DATE) || new Date().toISOString().split('T')[0]
  } catch (e) {
    console.error('Error loading selected date:', e)
    return new Date().toISOString().split('T')[0]
  }
}

// IndexedDB: Tasks
export const saveTasks = async (tasks: Task[]) => {
  const database = await getDB()
  const tx = database.transaction(['tasks'], 'readwrite')
  const store = tx.objectStore('tasks')

  // Clear existing
  store.clear()

  // Add all
  for (const task of tasks) {
    store.add(task)
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(undefined)
    tx.onerror = () => reject(tx.error)
  })
}

export const loadTasks = async (): Promise<Task[]> => {
  const database = await getDB()
  const tx = database.transaction(['tasks'], 'readonly')
  const store = tx.objectStore('tasks')
  const request = store.getAll()

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// IndexedDB: Habit Checks
export const saveHabitCheck = async (check: HabitCheck) => {
  const database = await getDB()
  const tx = database.transaction(['habitChecks'], 'readwrite')
  const store = tx.objectStore('habitChecks')

  return new Promise((resolve, reject) => {
    const request = store.put(check)
    request.onsuccess = () => resolve(undefined)
    request.onerror = () => reject(request.error)
  })
}

export const loadHabitChecks = async (): Promise<HabitCheck[]> => {
  const database = await getDB()
  const tx = database.transaction(['habitChecks'], 'readonly')
  const store = tx.objectStore('habitChecks')
  const request = store.getAll()

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// IndexedDB: Reviews
export const saveDailyReview = async (review: DailyReview) => {
  const database = await getDB()
  const tx = database.transaction(['reviews'], 'readwrite')
  const store = tx.objectStore('reviews')

  return new Promise((resolve, reject) => {
    const request = store.put(review)
    request.onsuccess = () => resolve(undefined)
    request.onerror = () => reject(request.error)
  })
}

export const loadDailyReview = async (date: string): Promise<DailyReview | undefined> => {
  const database = await getDB()
  const tx = database.transaction(['reviews'], 'readonly')
  const store = tx.objectStore('reviews')
  const request = store.get(date)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const loadAllReviews = async (): Promise<DailyReview[]> => {
  const database = await getDB()
  const tx = database.transaction(['reviews'], 'readonly')
  const store = tx.objectStore('reviews')
  const request = store.getAll()

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Export/Import
export const exportAllData = async (
  habits: Habit[],
  categories: Category[],
  tasks: Task[],
  habitChecks: HabitCheck[],
  reviews: DailyReview[]
) => {
  return JSON.stringify({
    version: 1,
    exported_at: new Date().toISOString(),
    habits,
    categories,
    tasks,
    habitChecks,
    reviews,
  }, null, 2)
}

export const importData = async (
  jsonString: string,
  setHabits: (h: Habit[]) => void,
  setCategories: (c: Category[]) => void,
  setTasks: (t: Task[]) => void,
  setHabitChecks: (h: HabitCheck[]) => void,
  setReviews: (r: DailyReview[]) => void
) => {
  try {
    const data = JSON.parse(jsonString)

    if (data.habits) {
      setHabits(data.habits)
      saveHabits(data.habits)
    }
    if (data.categories) {
      setCategories(data.categories)
      saveCategories(data.categories)
    }
    if (data.tasks) {
      setTasks(data.tasks)
      await saveTasks(data.tasks)
    }
    if (data.habitChecks) {
      setHabitChecks(data.habitChecks)
      const database = await getDB()
      const tx = database.transaction(['habitChecks'], 'readwrite')
      const store = tx.objectStore('habitChecks')
      store.clear()
      for (const check of data.habitChecks) {
        store.add(check)
      }
    }
    if (data.reviews) {
      setReviews(data.reviews)
      const database = await getDB()
      const tx = database.transaction(['reviews'], 'readwrite')
      const store = tx.objectStore('reviews')
      store.clear()
      for (const review of data.reviews) {
        store.add(review)
      }
    }
    return true
  } catch (e) {
    console.error('Error importing data:', e)
    return false
  }
}
