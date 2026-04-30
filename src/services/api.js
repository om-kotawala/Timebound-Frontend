
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'tb_token'

const api = axios.create({ baseURL: BASE, timeout: 10000 })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) cfg.headers.Authorization = 'Bearer ' + token
  cfg.headers['X-Timezone-Offset'] = String(new Date().getTimezoneOffset())
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register:   (data) => api.post('/auth/register', data),
  sendOTP:    (email) => api.post('/auth/send-otp', { email }),
  verifyOTP:  (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  me:         () => api.get('/auth/me'),
}

export const profileAPI = {
  get:    () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
}

export const tasksAPI = {
  create:   (data) => api.post('/tasks', data),
  assignableUsers: () => api.get('/tasks/assignable-users'),
  today:    () => api.get('/tasks/today'),
  byDate:   (date) => api.get('/tasks/date/' + date),
  update:   (id, data) => api.put('/tasks/' + id, data),
  delete:   (id) => api.delete('/tasks/' + id),
  complete: (id) => api.patch('/tasks/' + id + '/complete'),
  submitProof: (id, file) => {
    const formData = new FormData()
    formData.append('proof', file)
    return api.post('/tasks/' + id + '/proof', formData)
  },
  approveProof: (id) => api.patch('/tasks/' + id + '/proof/approve'),
  rejectProof: (id, reason) => api.patch('/tasks/' + id + '/proof/reject', { reason }),
}

export const progressAPI = {
  daily:   (date) => api.get('/progress/daily/' + date),
  monthly: (month, year) => api.get('/progress/monthly/' + month + '/' + year),
  yearly:  (year) => api.get('/progress/yearly/' + year),
}

export default api
