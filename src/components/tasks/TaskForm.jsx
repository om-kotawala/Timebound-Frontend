
import React, { memo, useState, useCallback } from 'react'
import { Plus, Send, Tag, UserRound } from 'lucide-react'
import { PRIORITIES, PRIORITY_CONFIG } from '../../constants'
import Spinner from '../ui/Spinner'

const TaskForm = memo(({ onSubmit, loading, userRole, assignableUsers = [], assignableUsersLoading = false }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [taskType, setTaskType] = useState('Personal')
  const [assigneeId, setAssigneeId] = useState('')
  const canAssign = userRole !== 'Student'

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const ok = await onSubmit({
      title: title.trim(),
      priority,
      taskType,
      assigneeId: taskType === 'Assigned' ? assigneeId : undefined,
    })
    if (ok) {
      setTitle('')
      if (taskType === 'Personal') setAssigneeId('')
    }
  }, [title, priority, taskType, assigneeId, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Plus size={16} className="text-volt-300" />
        <h2 className="text-sm font-display font-bold text-ink-200 uppercase tracking-widest">New Task</h2>
      </div>

      <div>
        <input
          className="input-field"
          placeholder="What do you need to accomplish today?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={200}
          disabled={loading}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-ink-500">{title.length}/200</span>
        </div>
      </div>

      {canAssign && (
        <div>
          <label className="flex items-center gap-1.5 text-xs text-ink-400 mb-2 uppercase tracking-widest">
            <Send size={11} /> Task Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'Personal', label: 'Personal Task' },
              { value: 'Assigned', label: 'Assign Task' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTaskType(option.value)}
                className="py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: taskType === option.value ? 'rgb(var(--volt-300) / 0.12)' : 'rgb(var(--surface-muted) / 0.78)',
                  border: `1px solid ${taskType === option.value ? 'rgb(var(--volt-300) / 0.3)' : 'rgb(var(--ink-300) / 0.12)'}`,
                  color: taskType === option.value ? 'rgb(var(--volt-300))' : 'rgb(var(--ink-400))',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {canAssign && taskType === 'Assigned' && (
        <div>
          <label className="flex items-center gap-1.5 text-xs text-ink-400 mb-2 uppercase tracking-widest">
            <UserRound size={11} /> Assign To
          </label>
          <select
            className="input-field"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={loading || assignableUsersLoading}
          >
            <option value="">Select a user</option>
            {assignableUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          {assignableUsersLoading && <p className="text-xs text-ink-500 mt-1">Loading available users...</p>}
          {!assignableUsersLoading && assignableUsers.length === 0 && (
            <p className="text-xs text-ink-500 mt-1">No users are available for this role to assign right now.</p>
          )}
        </div>
      )}

      <div>
        <label className="flex items-center gap-1.5 text-xs text-ink-400 mb-2 uppercase tracking-widest">
          <Tag size={11} /> Priority
        </label>
        <div className="flex gap-2">
          {PRIORITIES.map(p => {
            const cfg = PRIORITY_CONFIG[p]
            return (
              <button
                key={p} type="button"
                onClick={() => setPriority(p)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: priority === p ? cfg.bg : 'rgb(var(--surface-muted) / 0.78)',
                  border: `1px solid ${priority === p ? cfg.border : 'rgb(var(--ink-300) / 0.12)'}`,
                  color: priority === p ? cfg.color : 'rgb(var(--ink-400))',
                  boxShadow: priority === p ? `0 0 12px ${cfg.color}20` : 'none',
                }}
              >
                {p}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={loading || !title.trim() || (taskType === 'Assigned' && !assigneeId)}
      >
        {loading ? <Spinner size={16} color="rgb(var(--accent-contrast))" /> : <><Plus size={16} />{taskType === 'Assigned' ? 'Assign Task' : 'Add Task'}</>}
      </button>
    </form>
  )
})

export default TaskForm
