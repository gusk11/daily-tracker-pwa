export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00')
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  const dayName = days[date.getDay()]
  const day = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${dayName}, ${day}. ${monthName} ${year}`
}

export const toDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr + 'T00:00:00')
  date.setDate(date.getDate() + days)
  return toDateString(date)
}

export const getPreviousDay = (dateStr: string): string => addDays(dateStr, -1)
export const getNextDay = (dateStr: string): string => addDays(dateStr, 1)
export const getToday = (): string => toDateString(new Date())

export const getMonday = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  return toDateString(date)
}

export const getSunday = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? 0 : 7)
  date.setDate(diff)
  return toDateString(date)
}

export const getWeekDates = (dateStr: string): string[] => {
  const monday = getMonday(dateStr)
  const dates: string[] = []
  let current = monday

  for (let i = 0; i < 7; i++) {
    dates.push(current)
    current = getNextDay(current)
  }

  return dates
}

export const isToday = (dateStr: string): boolean => dateStr === getToday()

export const isPastDate = (dateStr: string): boolean => {
  const today = getToday()
  return dateStr < today
}

export const isSameDay = (date1: string, date2: string): boolean => date1 === date2

export const isOverdue = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false
  return isPastDate(dateStr) && dateStr !== getToday()
}

export const daysUntil = (dateStr: string | undefined): number => {
  if (!dateStr) return Infinity

  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diff = date.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const isThisWeek = (dateStr: string): boolean => {
  const monday = getMonday(dateStr)
  const sunday = getNextDay(getSunday(dateStr))
  const today = getToday()
  return today >= monday && today < sunday
}
