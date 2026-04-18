// ================== PRIORITIES ==================
export const PRIORITIES = Object.freeze(['Important', 'Urgent', 'Medium'])
export const ROLES = Object.freeze(['Principal', 'HOD', 'Professor', 'Student'])

export const TASK_TYPE_FILTERS = Object.freeze({
  Principal: [
    { value: 'Personal', label: 'Personal' },
    { value: 'AssignedByMe', label: 'Assigned by Me' },
  ],
  HOD: [
    { value: 'Personal', label: 'Personal' },
    { value: 'AssignedToMe', label: 'Assigned to Me' },
    { value: 'AssignedByMe', label: 'Assigned by Me' },
  ],
  Professor: [
    { value: 'Personal', label: 'Personal' },
    { value: 'AssignedToMe', label: 'Assigned to Me' },
    { value: 'AssignedByMe', label: 'Assigned by Me' },
  ],
  Student: [
    { value: 'Personal', label: 'Personal' },
    { value: 'AssignedToMe', label: 'Assigned to Me' },
  ],
})

export const PRIORITY_CONFIG = Object.freeze({
  Important: {
    label: 'Important',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.12)',
    border: 'rgba(255,107,107,0.35)',
    badge: 'badge-important',
    weight: 3,
  },
  Urgent: {
    label: 'Urgent',
    color: '#FFB347',
    bg: 'rgba(255,179,71,0.12)',
    border: 'rgba(255,179,71,0.35)',
    badge: 'badge-urgent',
    weight: 2,
  },
  Medium: {
    label: 'Medium',
    color: '#74C0FC',
    bg: 'rgba(116,192,252,0.12)',
    border: 'rgba(116,192,252,0.35)',
    badge: 'badge-medium',
    weight: 1,
  },
})

// ================== STATUS ==================
export const STATUS = Object.freeze({
  PENDING: 'Pending',
  COMPLETED: 'Completed',
})

// ================== API ==================
export const API_BASE_URL =
  import.meta.env?.VITE_API_URL || 'http://localhost:5000/api'

// ================== AUTH ==================
export const TOKEN_KEY = 'tb_token'

// ================== DATE ==================
export const MONTHS = Object.freeze([
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
])

export const FULL_MONTHS = Object.freeze([
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
])

// ================== HELPERS ==================

// Get priority config safely
export const getPriorityConfig = (priority) => {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium
}

// Sort tasks by priority (Important > Urgent > Medium)
export const sortByPriority = (tasks = []) => {
  return [...tasks].sort(
    (a, b) =>
      (PRIORITY_CONFIG[b.priority]?.weight || 0) -
      (PRIORITY_CONFIG[a.priority]?.weight || 0)
  )
}

// Format date (useful everywhere)
export const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// Calculate progress %
export const calculateProgress = (total, completed) => {
  if (!total) return 0
  return Math.round((completed / total) * 100)
}

export const getTaskTypeFilters = (role) => TASK_TYPE_FILTERS[role] || TASK_TYPE_FILTERS.Student
