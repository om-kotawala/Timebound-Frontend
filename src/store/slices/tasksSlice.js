import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { tasksAPI } from '../../services/api'
import { sortByPriority } from '../../utils'

const normalizeProofSubmission = (proofSubmission) => {
  if (!proofSubmission) return null

  const fileName = proofSubmission.fileName || proofSubmission.originalName || proofSubmission.name || ''
  const fileUrl = proofSubmission.fileUrl || proofSubmission.url || proofSubmission.path || ''
  const reviewedBy = proofSubmission.reviewedBy || proofSubmission.verifiedBy || null
  const status = proofSubmission.status
    || (proofSubmission.rejectedAt || proofSubmission.rejectionReason ? 'rejected' : null)
    || (proofSubmission.approvedAt || proofSubmission.verifiedAt ? 'approved' : null)
    || 'pending_review'

  return {
    ...proofSubmission,
    fileName,
    fileUrl,
    reviewedBy,
    rejectionReason: proofSubmission.rejectionReason || proofSubmission.rejectReason || '',
    reviewedAt: proofSubmission.reviewedAt || proofSubmission.verifiedAt || proofSubmission.approvedAt || proofSubmission.rejectedAt || null,
    submittedAt: proofSubmission.submittedAt || proofSubmission.createdAt || null,
    status,
  }
}

const normalizeTask = (task) => {
  const taskView = task?.taskView || 'Personal'
  const proofSubmission = normalizeProofSubmission(task?.proofSubmission || task?.proof || null)

  return {
    ...task,
    taskView,
    proofSubmission,
    permissions: {
      canComplete: task?.permissions?.canComplete ?? taskView === 'Personal',
      canEdit: task?.permissions?.canEdit ?? taskView !== 'AssignedToMe',
      canDelete: task?.permissions?.canDelete ?? taskView !== 'AssignedToMe',
      canSubmitProof: task?.permissions?.canSubmitProof ?? taskView === 'AssignedToMe',
      canReviewProof: task?.permissions?.canReviewProof ?? taskView === 'AssignedByMe',
    },
  }
}

const normalizeTaskList = (tasks = []) => tasks.map(normalizeTask)

const replaceTaskInList = (tasks, task) => {
  const normalizedTask = normalizeTask(task)
  const idx = tasks.findIndex((item) => item._id === normalizedTask._id)
  if (idx === -1) return tasks

  const next = [...tasks]
  next[idx] = normalizedTask
  return next
}

const updateTaskCollections = (state, task) => {
  state.items = replaceTaskInList(state.items, task)
  state.historyItems = replaceTaskInList(state.historyItems, task)
}

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

export const submitTaskProof = createAsyncThunk('tasks/submitProof', async ({ id, file }, { rejectWithValue }) => {
  try { const r = await tasksAPI.submitProof(id, file); return r.data.task }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to submit proof') }
})

export const approveTaskProof = createAsyncThunk('tasks/approveProof', async (id, { rejectWithValue }) => {
  try { const r = await tasksAPI.approveProof(id); return r.data.task }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to approve proof') }
})

export const rejectTaskProof = createAsyncThunk('tasks/rejectProof', async ({ id, reason }, { rejectWithValue }) => {
  try { const r = await tasksAPI.rejectProof(id, reason); return r.data.task }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to reject proof') }
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
      .addCase(fetchTodayTasks.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = normalizeTaskList(payload)
      })
      .addCase(fetchTasksByDate.pending, pending).addCase(fetchTasksByDate.rejected, rejected)
      .addCase(fetchTasksByDate.fulfilled, (state, { payload }) => {
        state.loading = false
        state.historyItems = normalizeTaskList(payload)
      })
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
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items.unshift(normalizeTask(payload))
      })
      .addCase(updateTask.pending, pending).addCase(updateTask.rejected, rejected)
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.loading = false
        updateTaskCollections(state, payload)
      })
      .addCase(deleteTask.pending, pending).addCase(deleteTask.rejected, rejected)
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = state.items.filter((task) => task._id !== payload)
        state.historyItems = state.historyItems.filter((task) => task._id !== payload)
      })
      .addCase(completeTask.pending, pending).addCase(completeTask.rejected, rejected)
      .addCase(completeTask.fulfilled, (state, { payload }) => {
        state.loading = false
        updateTaskCollections(state, payload)
      })
      .addCase(submitTaskProof.pending, pending).addCase(submitTaskProof.rejected, rejected)
      .addCase(submitTaskProof.fulfilled, (state, { payload }) => {
        state.loading = false
        updateTaskCollections(state, payload)
      })
      .addCase(approveTaskProof.pending, pending).addCase(approveTaskProof.rejected, rejected)
      .addCase(approveTaskProof.fulfilled, (state, { payload }) => {
        state.loading = false
        updateTaskCollections(state, payload)
      })
      .addCase(rejectTaskProof.pending, pending).addCase(rejectTaskProof.rejected, rejected)
      .addCase(rejectTaskProof.fulfilled, (state, { payload }) => {
        state.loading = false
        updateTaskCollections(state, payload)
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
