import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
  selectFilteredTasks,
  selectProgressStats,
  selectTasksLoading,
  selectTasksError,
  selectFilter,
  selectAssignableUsers,
  selectAssignableUsersLoading,
  setFilter,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  fetchTodayTasks,
  fetchAssignableUsers,
} from '../store/slices/tasksSlice'
import { selectUser } from '../store/slices/authSlice'
import { getTaskTypeFilters } from '../constants'

export const useTasks = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(selectFilteredTasks)
  const stats = useSelector(selectProgressStats)
  const loading = useSelector(selectTasksLoading)
  const error = useSelector(selectTasksError)
  const filter = useSelector(selectFilter)
  const assignableUsers = useSelector(selectAssignableUsers)
  const assignableUsersLoading = useSelector(selectAssignableUsersLoading)
  const user = useSelector(selectUser)
  const taskTypeOptions = getTaskTypeFilters(user?.role)

  useEffect(() => {
    dispatch(fetchTodayTasks())
    if (user?.role && user.role !== 'Student') {
      dispatch(fetchAssignableUsers())
    }
  }, [dispatch, user?.role])

  const handleCreate = useCallback(async (data) => {
    if (!data.title?.trim()) { toast.error('Task title is required'); return false }
    if (data.taskType === 'Assigned' && !data.assigneeId) { toast.error('Choose who should receive this task'); return false }
    const result = await dispatch(createTask(data))
    if (createTask.fulfilled.match(result)) { toast.success('Task created!'); return true }
    toast.error(result.payload || 'Failed to create task')
    return false
  }, [dispatch])

  const handleUpdate = useCallback(async (id, data) => {
    const result = await dispatch(updateTask({ id, data }))
    if (updateTask.fulfilled.match(result)) { toast.success('Task updated!'); return true }
    toast.error(result.payload || 'Failed to update task')
    return false
  }, [dispatch])

  const handleDelete = useCallback(async (id) => {
    const result = await dispatch(deleteTask(id))
    if (deleteTask.fulfilled.match(result)) { toast.success('Task deleted'); return true }
    toast.error(result.payload || 'Failed to delete task')
    return false
  }, [dispatch])

  const handleComplete = useCallback(async (id) => {
    const result = await dispatch(completeTask(id))
    if (completeTask.fulfilled.match(result)) { toast.success('Task completed!'); return true }
    toast.error(result.payload || 'Failed to complete task')
    return false
  }, [dispatch])

  const handleFilter = useCallback((updates) => dispatch(setFilter(updates)), [dispatch])

  return {
    tasks,
    stats,
    loading,
    error,
    filter,
    userRole: user?.role || 'Student',
    assignableUsers,
    assignableUsersLoading,
    taskTypeOptions,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleComplete,
    handleFilter,
  }
}
