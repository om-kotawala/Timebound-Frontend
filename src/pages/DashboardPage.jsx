
import React, { memo, useState, useCallback, useMemo } from 'react'
import { CheckSquare, Circle, Lock, TrendingUp, ListTodo, Zap } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskForm from '../components/tasks/TaskForm'
import TaskCard from '../components/ui/TaskCard'
import FilterBar from '../components/tasks/FilterBar'
import EditTaskModal from '../components/tasks/EditTaskModal'
import ProgressRing from '../components/ui/ProgressRing'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'

const DashboardPage = () => {
  const {
    tasks,
    stats,
    loading,
    filter,
    userRole,
    assignableUsers,
    assignableUsersLoading,
    taskTypeOptions,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleComplete,
    handleFilter,
  } = useTasks()
  const [editingTask, setEditingTask] = useState(null)

  const now = new Date()
  const greeting = useMemo(() => {
    const h = now.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const dateStr = useMemo(() => now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), [])

  const handleEdit = useCallback((task) => setEditingTask(task), [])
  const handleCloseEdit = useCallback(() => setEditingTask(null), [])
  const handleSaveEdit = useCallback((id, data) => handleUpdate(id, data), [handleUpdate])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-ink-400 mb-1">{dateStr}</p>
          <h1 className="text-4xl font-display font-extrabold text-ink-50">
            {greeting} <span className="text-gradient">👋</span>
          </h1>
          <p className="text-ink-400 mt-1 text-sm">
            {stats.total === 0 ? "You have no tasks yet. Start by adding one!" : `${stats.pending} task${stats.pending !== 1 ? 's' : ''} remaining today`}
          </p>
        </div>

        <ProgressRing pct={stats.pct} size={100} stroke={8} label="Today" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} icon={ListTodo} color="#9494BA" />
        <StatCard label="Completed" value={stats.completed} icon={CheckSquare} color="#C8FF00" sublabel={stats.pct + '% done'} />
        <StatCard label="Pending" value={stats.pending} icon={Circle} color="#FFB347" />
        <StatCard label="Locked" value={stats.locked} icon={Lock} color="#FF6B6B" sublabel="past deadline" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
        {/* Left: Task form */}
        <div className="space-y-4">
          <TaskForm
            onSubmit={handleCreate}
            loading={loading}
            userRole={userRole}
            assignableUsers={assignableUsers}
            assignableUsersLoading={assignableUsersLoading}
          />

          {/* Quick tip */}
          <div className="p-4 rounded-2xl flex gap-3" style={{ background: 'rgb(var(--volt-300) / 0.06)', border: '1px solid rgb(var(--volt-300) / 0.12)' }}>
            <Zap size={16} className="text-volt-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-display font-semibold text-volt-300 mb-0.5">Deadline enforcement</p>
              <p className="text-xs text-ink-400 leading-relaxed">All tasks auto-lock at 11:59 PM today. Plan your day wisely!</p>
            </div>
          </div>
        </div>

        {/* Right: Task list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-ink-200 uppercase tracking-widest">
              Today's Tasks
              {tasks.length > 0 && <span className="ml-2 text-xs text-ink-500 font-normal normal-case tracking-normal">({tasks.length})</span>}
            </h2>
          </div>

          <div className="mb-4">
            <FilterBar filter={filter} onFilter={handleFilter} taskTypeOptions={taskTypeOptions} />
          </div>

          {loading && tasks.length === 0 ? (
            <div className="flex justify-center py-12"><Spinner size={32} /></div>
          ) : tasks.length === 0 ? (
            <EmptyState icon={ListTodo} title="No tasks found" description="Add your first task or adjust the filters to see results." />
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task._id} className="animate-slide-up">
                  <TaskCard
                    task={task}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        loading={loading}
      />
    </div>
  )
}

export default DashboardPage
