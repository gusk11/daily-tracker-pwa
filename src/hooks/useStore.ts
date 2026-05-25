import { useEffect, useReducer, useCallback } from 'react'
import type { Task, Habit, HabitCheck, Category, DailyReview, StoreState, StoreActions } from '../lib/types'
import {
  saveHabits, loadHabits, saveCategories, loadCategories,
  saveSelectedDate, loadSelectedDate, saveTasks, loadTasks,
  loadHabitChecks, saveDailyReview,
  loadAllReviews, importData, initDB
} from '../lib/storage'
import { generateId, debounce } from '../lib/utils'
import { getNextDay } from '../lib/dates'

type Action =
  | { type: 'INIT'; payload: StoreState }
  | { type: 'ADD_HABIT'; payload: { name: string; color: string } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT_STATUS'; payload: string }
  | { type: 'UPDATE_HABIT'; payload: { id: string; name: string; color: string } }
  | { type: 'ADD_CATEGORY'; payload: { name: string; color: string } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; name: string; color: string } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_HABIT_CHECK'; payload: { habitId: string; date: string; checked: boolean } }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'UPSERT_REVIEW'; payload: DailyReview }
  | { type: 'SET_REVIEWS'; payload: DailyReview[] }

const initialState: StoreState = {
  habits: [],
  categories: [],
  tasks: [],
  habitChecks: [],
  reviews: new Map(),
  selectedDate: new Date().toISOString().split('T')[0],
}

const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case 'INIT':
      return action.payload

    case 'ADD_HABIT': {
      const habit: Habit = {
        id: generateId(),
        name: action.payload.name,
        color: action.payload.color,
        is_active: true,
      }
      return { ...state, habits: [...state.habits, habit] }
    }

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
      }

    case 'TOGGLE_HABIT_STATUS': {
      const habit = state.habits.find(h => h.id === action.payload)
      if (!habit) return state
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload ? { ...h, is_active: !h.is_active } : h
        ),
      }
    }

    case 'UPDATE_HABIT': {
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload.id
            ? { ...h, name: action.payload.name, color: action.payload.color }
            : h
        ),
      }
    }

    case 'ADD_CATEGORY': {
      const category: Category = {
        id: generateId(),
        name: action.payload.name,
        color: action.payload.color,
      }
      return { ...state, categories: [...state.categories, category] }
    }

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      }

    case 'UPDATE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id
            ? { ...c, name: action.payload.name, color: action.payload.color }
            : c
        ),
      }
    }

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      }

    case 'TOGGLE_HABIT_CHECK': {
      const { habitId, date, checked } = action.payload
      const existing = state.habitChecks.find(c => c.habit_id === habitId && c.date === date)

      if (existing) {
        return {
          ...state,
          habitChecks: state.habitChecks.map(c =>
            c.id === existing.id ? { ...c, checked } : c
          ),
        }
      }

      const newCheck: HabitCheck = {
        id: generateId(),
        habit_id: habitId,
        date,
        checked,
      }
      return { ...state, habitChecks: [...state.habitChecks, newCheck] }
    }

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload }

    case 'UPSERT_REVIEW': {
      const newReviews = new Map(state.reviews)
      newReviews.set(action.payload.date, action.payload)
      return { ...state, reviews: newReviews }
    }

    case 'SET_REVIEWS': {
      const reviewMap = new Map<string, DailyReview>()
      action.payload.forEach(review => reviewMap.set(review.date, review))
      return { ...state, reviews: reviewMap }
    }

    default:
      return state
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Initialize from storage
  useEffect(() => {
    const initialize = async () => {
      await initDB()

      const habits = loadHabits()
      const categories = loadCategories()
      const selectedDate = loadSelectedDate()
      const tasks = await loadTasks()
      const habitChecks = await loadHabitChecks()
      const reviews = await loadAllReviews()

      // Initialize default categories if empty
      let finalCategories = categories
      if (finalCategories.length === 0) {
        finalCategories = [
          { id: generateId(), name: 'Uni', color: 'blue' },
          { id: generateId(), name: 'Nachhilfe', color: 'purple' },
          { id: generateId(), name: 'Content', color: 'green' },
          { id: generateId(), name: 'Privat', color: 'pink' },
        ]
        saveCategories(finalCategories)
      }

      const reviewMap = new Map<string, DailyReview>()
      reviews.forEach(review => reviewMap.set(review.date, review))

      dispatch({
        type: 'INIT',
        payload: {
          habits,
          categories: finalCategories,
          tasks,
          habitChecks,
          reviews: reviewMap,
          selectedDate,
        },
      })
    }

    initialize()
  }, [])

  // Debounced save functions
  const debouncedSaveHabits = useCallback(debounce(saveHabits, 500), [])
  const debouncedSaveCategories = useCallback(debounce(saveCategories, 500), [])
  const debouncedSaveTasks = useCallback(debounce(saveTasks, 500), [])

  useEffect(() => {
    debouncedSaveHabits(state.habits)
  }, [state.habits, debouncedSaveHabits])

  useEffect(() => {
    debouncedSaveCategories(state.categories)
  }, [state.categories, debouncedSaveCategories])

  useEffect(() => {
    debouncedSaveTasks(state.tasks)
  }, [state.tasks, debouncedSaveTasks])

  // Actions
  const actions: StoreActions = {
    addHabit: (name, color) => {
      dispatch({ type: 'ADD_HABIT', payload: { name, color } })
    },

    deleteHabit: (id) => {
      dispatch({ type: 'DELETE_HABIT', payload: id })
    },

    toggleHabitStatus: (id) => {
      dispatch({ type: 'TOGGLE_HABIT_STATUS', payload: id })
    },

    updateHabit: (id, name, color) => {
      dispatch({ type: 'UPDATE_HABIT', payload: { id, name, color } })
    },

    addCategory: (name, color) => {
      dispatch({ type: 'ADD_CATEGORY', payload: { name, color } })
    },

    deleteCategory: (id) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: id })
    },

    updateCategory: (id, name, color) => {
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, name, color } })
    },

    addTask: (task) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_TASK', payload: newTask })
    },

    updateTask: (id, task) => {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id, data: { ...task, updated_at: new Date().toISOString() } },
      })
    },

    deleteTask: (id) => {
      dispatch({ type: 'DELETE_TASK', payload: id })
    },

    completeTask: (id, date) => {
      actions.updateTask(id, {
        status: 'done',
        completed_at: new Date().toISOString(),
        completed_date: date,
      })
    },

    postponeTask: (id) => {
      const task = state.tasks.find(t => t.id === id)
      if (!task) return

      const nextDate = task.due_date ? getNextDay(task.due_date) : getNextDay(state.selectedDate)

      actions.updateTask(id, {
        due_date: nextDate,
        postponed_count: (task.postponed_count || 0) + 1,
        last_postponed_at: new Date().toISOString(),
      })
    },

    toggleHabitCheck: (habitId, date) => {
      const existing = state.habitChecks.find(c => c.habit_id === habitId && c.date === date)
      dispatch({
        type: 'TOGGLE_HABIT_CHECK',
        payload: { habitId, date, checked: !existing?.checked },
      })
    },

    getHabitCheckForDate: (habitId, date) => {
      return state.habitChecks.some(c => c.habit_id === habitId && c.date === date && c.checked)
    },

    setSelectedDate: (date) => {
      dispatch({ type: 'SET_SELECTED_DATE', payload: date })
      saveSelectedDate(date)
    },

    upsertDailyReview: (date, review) => {
      const existing = state.reviews.get(date)
      const newReview: DailyReview = {
        id: existing?.id || generateId(),
        date,
        ...existing,
        ...review,
        updated_at: new Date().toISOString(),
        created_at: existing?.created_at || new Date().toISOString(),
      }
      dispatch({ type: 'UPSERT_REVIEW', payload: newReview })
      saveDailyReview(newReview)
    },

    getDailyReview: (date) => {
      return state.reviews.get(date)
    },

    exportData: () => {
      // Synchronous export - return as string
      return JSON.stringify({
        version: 1,
        exported_at: new Date().toISOString(),
        habits: state.habits,
        categories: state.categories,
        tasks: state.tasks,
        habitChecks: state.habitChecks,
        reviews: Array.from(state.reviews.values()),
      }, null, 2)
    },

    importData: (json) => {
      // Synchronous wrapper for async importData
      importData(json,
        (h) => dispatch({ type: 'INIT', payload: { ...state, habits: h } }),
        (c) => dispatch({ type: 'INIT', payload: { ...state, categories: c } }),
        (t) => dispatch({ type: 'INIT', payload: { ...state, tasks: t } }),
        (h) => dispatch({ type: 'INIT', payload: { ...state, habitChecks: h } }),
        (r) => dispatch({ type: 'SET_REVIEWS', payload: r })
      ).catch(console.error)
      return true
    },
  }

  return { ...state, ...actions }
}
