
const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const pad = (value) => String(value).padStart(2, '0')

export const IST_TIMEZONE = 'Asia/Kolkata'

const formatInIST = (date, options) =>
  new Intl.DateTimeFormat('en-US', { timeZone: IST_TIMEZONE, ...options }).format(date)

const getISTParts = (value) => {
  const date = parseDateInput(value)
  if (Number.isNaN(date.getTime())) return null

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  return parts.reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value
    return acc
  }, {})
}

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

export const getCurrentISTParts = () => getISTParts(new Date()) || {
  year: '1970',
  month: '01',
  day: '01',
  hour: '00',
  minute: '00',
}

export const getCurrentISTHour = () => Number(getCurrentISTParts().hour)

export const formatLocalDateKey = (value) => {
  if (typeof value === 'string') {
    const match = value.match(DATE_ONLY_RE)
    if (match) return value
  }

  const parts = getISTParts(value)
  if (!parts) return ''
  return `${parts.year}-${parts.month}-${parts.day}`
}

export const formatDate = (date, opts = {}) => {
  try {
    const d = parseDateInput(date)
    if (Number.isNaN(d.getTime())) return ''
    if (opts.timeOnly) return formatInIST(d, { hour: '2-digit', minute: '2-digit' })
    if (opts.monthYear) return formatInIST(d, { month: 'long', year: 'numeric' })
    if (opts.weekdayLong) return formatInIST(d, { weekday: 'long', month: 'long', day: 'numeric' })
    if (opts.weekdayShort) return formatInIST(d, { weekday: 'short', month: 'short', day: 'numeric' })
    if (opts.short) return formatInIST(d, { month: 'short', day: 'numeric' })
    return formatInIST(d, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

export const isTaskLocked = (deadline) => parseDateInput(deadline).getTime() < Date.now()

export const isToday = (date) => formatLocalDateKey(date) === formatLocalDateKey(new Date())

export const getTimeRemaining = (deadline) => {
  const dl = parseDateInput(deadline)
  const now = Date.now()
  if (Number.isNaN(dl.getTime())) return { text: 'Unknown deadline', urgent: false, expired: false }
  if (dl.getTime() < now) return { text: 'Expired', urgent: false, expired: true }

  const diffMs = dl.getTime() - now
  const mins = Math.floor(diffMs / 60000)
  const hrs = Math.floor(mins / 60)

  if (mins < 60) return { text: mins + 'm left', urgent: true, expired: false }
  if (hrs < 3) return { text: hrs + 'h ' + (mins % 60) + 'm left', urgent: true, expired: false }
  return { text: hrs + 'h left', urgent: false, expired: false }
}

export const calcProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  const completed = tasks.filter((t) => t.status === 'Completed').length
  return Math.round((completed / tasks.length) * 100)
}

export const sortByPriority = (tasks) => {
  const order = { Important: 0, Urgent: 1, Medium: 2 }
  return [...tasks].sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3))
}

export const getDeadlineForToday = () => {
  const { year, month, day } = getCurrentISTParts()
  return new Date(`${year}-${month}-${day}T23:59:00+05:30`).toISOString()
}

export const formatFileSize = (size = 0) => {
  if (!size) return 'Unknown size'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export const generateId = () => '_' + Math.random().toString(36).slice(2, 11)
export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const getDatesWithTasks = (tasks) => {
  const dates = {}
  tasks.forEach((t) => {
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
