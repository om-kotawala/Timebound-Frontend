import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark'
  return localStorage.getItem('tb_theme') || 'dark'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    editingTask: null,
    confirmDelete: null,
    selectedCalendarDate: new Date().toISOString(),
    theme: getInitialTheme(),
  },
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen },
    setEditingTask: (s, a) => { s.editingTask = a.payload },
    setConfirmDelete: (s, a) => { s.confirmDelete = a.payload },
    setSelectedDate: (s, a) => { s.selectedCalendarDate = a.payload },
    setTheme: (s, a) => { s.theme = a.payload },
    toggleTheme: (s) => { s.theme = s.theme === 'dark' ? 'light' : 'dark' },
  },
})
export const {
  toggleSidebar,
  setEditingTask,
  setConfirmDelete,
  setSelectedDate,
  setTheme,
  toggleTheme,
} = uiSlice.actions
export const selectTheme = (state) => state.ui.theme
export default uiSlice.reducer
