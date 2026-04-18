
const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const pad = (value) => String(value).padStart(2, '0')

export const parseDateInput = (value) => {
  if (value instanceof Date) return new Date(value.getTime())
  if (typeof value === 'string') {
    const match = value.match(DATE_ONLY_RE)
    if (match) {
      const [, year, month, day] = match
      return new Date(Number(year), Number(month) - 1, Number(day))
    }
  }

  return new Date(value)
}

export const formatLocalDateKey = (value) => {
  const d = parseDateInput(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const formatDate = (date, opts = {}) => {
  try {
    const d = parseDateInput(date)
    if (opts.timeOnly) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    if (opts.monthYear) return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (opts.short) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '' }
}

export const isTaskLocked = (deadline) => new Date(deadline) < new Date()
export const isToday = (date) => {
  const d = parseDateInput(date), t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}

export const getTimeRemaining = (deadline) => {
  const dl = new Date(deadline)
  const now = new Date()
  if (dl < now) return { text: 'Expired', urgent: false, expired: true }
  const diffMs = dl - now
  const mins = Math.floor(diffMs / 60000)
  const hrs = Math.floor(mins / 60)
  if (mins < 60) return { text: mins + 'm left', urgent: true, expired: false }
  if (hrs < 3) return { text: hrs + 'h ' + (mins % 60) + 'm left', urgent: true, expired: false }
  return { text: hrs + 'h left', urgent: false, expired: false }
}

export const calcProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  const completed = tasks.filter(t => t.status === 'Completed').length
  return Math.round((completed / tasks.length) * 100)
}

export const sortByPriority = (tasks) => {
  const order = { Important: 0, Urgent: 1, Medium: 2 }
  return [...tasks].sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3))
}

export const getDeadlineForToday = () => {
  const d = new Date()
  d.setHours(23, 59, 0, 0)
  return d.toISOString()
}

export const generateId = () => '_' + Math.random().toString(36).substr(2, 9)
export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const getDatesWithTasks = (tasks) => {
  const dates = {}
  tasks.forEach(t => {
    const key = formatLocalDateKey(t.creationTime)
    if (!dates[key]) dates[key] = []
    dates[key].push(t)
  })
  return dates
}

export const getProgressColor = (pct) => {
  if (pct >= 80) return '#C8FF00'
  if (pct >= 50) return '#FFB347'
  return '#FF6B6B'
}
