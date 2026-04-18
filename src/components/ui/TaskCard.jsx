
import React, { memo, useState, useCallback } from 'react'
import { Check, Pencil, Trash2, Lock, Clock, AlertTriangle, Send, UserRound } from 'lucide-react'
import { PRIORITY_CONFIG } from '../../constants'
import { getTimeRemaining, formatDate, isTaskLocked } from '../../utils'

const TagBadge = ({ label }) => (
  <span
    className="px-2 py-1 rounded-full uppercase tracking-wide"
    style={{
      background: 'rgb(var(--volt-300) / 0.08)',
      border: '1px solid rgb(var(--volt-300) / 0.12)',
      color: 'rgb(var(--volt-300))',
      fontSize: '10px',
    }}
  >
    {label}
  </span>
)

const TaskCard = memo(({ task, onComplete, onEdit, onDelete, readonly = false }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const locked = task.isLocked || isTaskLocked(task.deadline)
  const done = task.status === 'Completed'
  const cfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium
  const timeLeft = getTimeRemaining(task.deadline)
  const canComplete = !readonly && task.permissions?.canComplete
  const canEdit = !readonly && task.permissions?.canEdit
  const canDelete = !readonly && task.permissions?.canDelete
  const assigneeName = typeof task.userId === 'object' ? task.userId?.name : ''
  const creatorName = typeof task.createdBy === 'object' ? task.createdBy?.name : ''
  const typeLabel = task.taskView === 'AssignedToMe'
    ? 'Assigned to Me'
    : task.taskView === 'AssignedByMe'
    ? 'Assigned by Me'
    : 'Personal'

  const handleDelete = useCallback(() => {
    if (confirmDelete) { onDelete(task._id); setConfirmDelete(false) }
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000) }
  }, [confirmDelete, onDelete, task._id])

  return (
    <div
      className="relative rounded-2xl border transition-all duration-300 p-4 group"
      style={{
        background: done ? 'rgb(var(--volt-300) / 0.04)' : locked ? 'rgb(var(--surface-muted) / 0.78)' : cfg.bg,
        borderColor: done ? 'rgb(var(--volt-300) / 0.2)' : locked ? 'rgb(var(--ink-500) / 0.3)' : cfg.border,
        opacity: locked && !done ? 0.7 : 1,
      }}
    >
      {/* Priority bar */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: done ? 'rgb(var(--volt-300))' : locked ? 'rgb(var(--ink-500))' : cfg.color, marginLeft: '-1px' }} />

      <div className="flex items-start gap-3 pl-3">
        {/* Complete button */}
        {canComplete ? (
          <button
            onClick={() => !locked && !done && onComplete(task._id)}
            disabled={locked || done}
            className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
            style={{
              borderColor: done ? 'rgb(var(--volt-300))' : cfg.color,
              background: done ? 'rgb(var(--volt-300))' : 'transparent',
              cursor: locked || done ? 'default' : 'pointer',
            }}
          >
            {done && <Check size={12} color="rgb(var(--accent-contrast))" strokeWidth={3} />}
          </button>
        ) : (
          <div className="w-6 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-medium leading-snug ${done ? 'line-through text-ink-400' : 'text-ink-100'}`}>
              {task.title}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-1.5">
              {locked && !done && <Lock size={12} className="text-ink-500" />}
              {done && <span className="badge badge-completed">Done</span>}
              {!done && !locked && <span className={`badge ${PRIORITY_CONFIG[task.priority]?.badge || 'badge-medium'}`}>{task.priority}</span>}
              {locked && !done && <span className="badge badge-locked">Locked</span>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-ink-400">
            <TagBadge label={typeLabel} />
            {task.taskView === 'AssignedToMe' && creatorName && (
              <span className="inline-flex items-center gap-1">
                <Send size={11} />
                Assigned by {creatorName}
              </span>
            )}
            {task.taskView === 'AssignedByMe' && assigneeName && (
              <span className="inline-flex items-center gap-1">
                <UserRound size={11} />
                Assigned to {assigneeName}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-ink-400">
                <Clock size={10} />
                {formatDate(task.creationTime, { timeOnly: true })}
              </span>
              {!done && (
                <span className={`flex items-center gap-1 text-xs font-medium ${timeLeft.urgent ? 'text-coral' : timeLeft.expired ? 'text-ink-500' : 'text-ink-300'}`}>
                  {timeLeft.urgent && !timeLeft.expired && <AlertTriangle size={10} />}
                  {timeLeft.text}
                </span>
              )}
            </div>

            {(canEdit || canDelete) && !locked && !done && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {canEdit && (
                  <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-white/5 text-ink-400 hover:text-ink-100 transition-colors">
                    <Pencil size={13} />
                  </button>
                )}
                {canDelete && (
                  <button onClick={handleDelete} className={`p-1.5 rounded-lg transition-colors ${confirmDelete ? 'bg-coral/20 text-coral' : 'hover:bg-white/5 text-ink-400 hover:text-coral'}`}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default TaskCard
