import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTodayTasks, selectFilteredTasks, selectTodayProgress, lockExpiredTasks } from '../store/slices/tasksSlice'
import TaskForm from '../components/tasks/TaskForm'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import EditTaskModal from '../components/tasks/EditTaskModal'
import DeleteConfirmModal from '../components/tasks/DeleteConfirmModal'
import ProgressRing from '../components/ui/ProgressRing'
import EmptyState from '../components/ui/EmptyState'
import { TaskSkeleton } from '../components/ui/Skeleton'
import StatCard from '../components/ui/StatCard'
import { CheckCircle2, Clock, ListTodo, Zap, Calendar } from 'lucide-react'
import { formatDate } from '../utils'

export default function HomePage() {
  const dispatch = useDispatch()
  const loading = useSelector(s => s.tasks.loading)
  const filteredTasks = useSelector(selectFilteredTasks)
  const progress = useSelector(selectTodayProgress)
  const user = useSelector(s => s.auth.user)

  useEffect(() => {
    dispatch(fetchTodayTasks())
    // Auto-lock expired tasks every minute
    const interval = setInterval(() => dispatch(lockExpiredTasks()), 60000)
    return () => clearInterval(interval)
  }, [dispatch])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const today = useMemo(() => formatDate(new Date()), [])

  const progressColor = progress.percentage >= 80 ? '#C8FF00' : progress.percentage >= 50 ? '#FFB347' : '#FF6B6B'

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 animate-slide-up sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-ink-400 text-sm font-body mb-1 flex items-center gap-2">
            <Calendar size={13}/> {today}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            {greeting}, <span className="text-gradient">{user?.name?.split(' ')[0] || 'friend'}.</span>
          </h1>
          <p className="text-ink-400 mt-1 font-body">
            {progress.total === 0
              ? "Start your day — add your first task below."
              : progress.percentage === 100
              ? "All tasks done! 🎉 Exceptional work today."
              : `${progress.pending} task${progress.pending !== 1 ? 's' : ''} remaining. Keep going!`}
          </p>
        </div>
        <ProgressRing
          percentage={progress.percentage}
          size={110}
          stroke={9}
          color={progressColor}
          label="today"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={progress.total} icon={ListTodo} color="#9494BA" delay={0}
          sub="tasks today" />
        <StatCard label="Completed" value={progress.completed} icon={CheckCircle2} color="#C8FF00" delay={80}
          sub="tasks done" />
        <StatCard label="Pending" value={progress.pending} icon={Clock} color="#FFB347" delay={160}
          sub="in progress" />
        <StatCard label="Progress" value={`${progress.percentage}%`} icon={Zap} color={progressColor} delay={240}
          sub="completion rate" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6">
        {/* Left: form */}
        <div className="space-y-4">
          <TaskForm />
        </div>

        {/* Right: task list */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-white">Today's Tasks</h2>
            <span className="badge badge-medium">{filteredTasks.length}</span>
          </div>
          <TaskFilters />

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_,i) => <TaskSkeleton key={i}/>)}
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              description="Add your first task using the form on the left. Tasks are locked at midnight."
            />
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, i) => (
                <TaskCard key={task._id} task={task} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <EditTaskModal />
      <DeleteConfirmModal />
    </div>
  )
}
