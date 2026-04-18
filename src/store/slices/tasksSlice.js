import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { tasksAPI } from '../../services/api'
import { sortByPriority } from '../../utils'

export const fetchTodayTasks = createAsyncThunk('tasks/fetchToday', async (_, { rejectWithValue }) => {
  try { const r = await tasksAPI.today(); return r.data.tasks }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch tasks') }
})

export const fetchTasksByDate = createAsyncThunk('tasks/fetchByDate', async (date, { rejectWithValue }) => {
  try { const r = await tasksAPI.byDate(date); return r.data.tasks }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch tasks') }
})

export const fetchAssignableUsers = createAsyncThunk('tasks/fetchAssignableUsers', async (_, { rejectWithValue }) => {
  try { const r = await tasksAPI.assignableUsers(); return r.data.users }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch assignable users') }
})

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try { const r = await tasksAPI.create(data); return r.data.task }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create task') }
})

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try { const r = await tasksAPI.update(id, data); return r.data.task }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update task') }
})

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try { await tasksAPI.delete(id); return id }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete task') }
})

export const completeTask = createAsyncThunk('tasks/complete', async (id, { rejectWithValue }) => {
  try { const r = await tasksAPI.complete(id); return r.data.task }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to complete task') }
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    historyItems: [],
    loading: false,
    assignableUsers: [],
    assignableUsersLoading: false,
    error: null,
    filter: { taskType: 'All', priority: 'All', status: 'All' },
  },
  reducers: {
    setFilter(state, { payload }) { state.filter = { ...state.filter, ...payload } },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload }

    builder
      .addCase(fetchTodayTasks.pending, pending).addCase(fetchTodayTasks.rejected, rejected)
      .addCase(fetchTodayTasks.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload })
      .addCase(fetchTasksByDate.pending, pending).addCase(fetchTasksByDate.rejected, rejected)
      .addCase(fetchTasksByDate.fulfilled, (state, { payload }) => { state.loading = false; state.historyItems = payload })
      .addCase(fetchAssignableUsers.pending, (state) => { state.assignableUsersLoading = true })
      .addCase(fetchAssignableUsers.rejected, (state) => {
        state.assignableUsersLoading = false
        state.assignableUsers = []
      })
      .addCase(fetchAssignableUsers.fulfilled, (state, { payload }) => {
        state.assignableUsersLoading = false
        state.assignableUsers = payload
      })
      .addCase(createTask.pending, pending).addCase(createTask.rejected, rejected)
      .addCase(createTask.fulfilled, (state, { payload }) => { state.loading = false; state.items.unshift(payload) })
      .addCase(updateTask.pending, pending).addCase(updateTask.rejected, rejected)
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.loading = false
        const idx = state.items.findIndex((task) => task._id === payload._id)
        if (idx !== -1) state.items[idx] = payload
      })
      .addCase(deleteTask.pending, pending).addCase(deleteTask.rejected, rejected)
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = state.items.filter((task) => task._id !== payload)
      })
      .addCase(completeTask.pending, pending).addCase(completeTask.rejected, rejected)
      .addCase(completeTask.fulfilled, (state, { payload }) => {
        state.loading = false
        const idx = state.items.findIndex((task) => task._id === payload._id)
        if (idx !== -1) state.items[idx] = payload
      })
  }
})

export const { setFilter, clearError } = tasksSlice.actions
export default tasksSlice.reducer

export const selectAllTasks = (s) => s.tasks.items
export const selectHistoryTasks = (s) => s.tasks.historyItems
export const selectTasksLoading = (s) => s.tasks.loading
export const selectTasksError = (s) => s.tasks.error
export const selectFilter = (s) => s.tasks.filter
export const selectAssignableUsers = (s) => s.tasks.assignableUsers
export const selectAssignableUsersLoading = (s) => s.tasks.assignableUsersLoading

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilter],
  (tasks, filter) => {
    let result = [...tasks]
    if (filter.taskType !== 'All') result = result.filter((task) => task.taskView === filter.taskType)
    if (filter.priority !== 'All') result = result.filter((task) => task.priority === filter.priority)
    if (filter.status !== 'All') result = result.filter((task) => task.status === filter.status)
    return sortByPriority(result)
  }
)

export const selectProgressStats = createSelector(
  [selectAllTasks],
  (tasks) => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === 'Completed').length
    const pending = tasks.filter((task) => task.status === 'Pending' && !task.isLocked).length
    const locked = tasks.filter((task) => task.isLocked && task.status === 'Pending').length
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, pending, locked, pct }
  }
)

export const selectTasksByPriority = createSelector(
  [selectAllTasks],
  (tasks) => ({
    Important: tasks.filter((task) => task.priority === 'Important').length,
    Urgent: tasks.filter((task) => task.priority === 'Urgent').length,
    Medium: tasks.filter((task) => task.priority === 'Medium').length,
  })
)
