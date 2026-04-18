import { memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { completeTask, deleteTask } from '../../store/slices/tasksSlice'
import { setEditingTask, setConfirmDelete } from '../../store/slices/uiSlice'
import { getTimeRemaining, formatDate, isTaskLocked } from '../../utils'
import { PRIORITY_CONFIG } from '../../constants'
import { CheckCircle2, Edit3, Trash2, Lock, Clock, AlertTriangle } from 'lucide-react'

const TaskCard = memo(function TaskCard({ task, index = 0 }) {
  const dispatch = useDispatch()
  const locked = isTaskLocked(task.deadline) || task.isLocked
  const completed = task.status === 'Completed'
  const timeInfo = getTimeRemaining(task.deadline)
  const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium

  const handleComplete = useCallback(() => {
    if (!locked && !completed) dispatch(completeTask(task._id))
  }, [locked, completed, task._id, dispatch])

  const handleEdit = useCallback(() => {
    if (!locked && !completed) dispatch(setEditingTask(task))
  }, [locked, completed, task, dispatch])

  const handleDelete = useCallback(() => {
    if (!locked) dispatch(setConfirmDelete(task._id))
  }, [locked, task._id, dispatch])

  return (
    <div
      className="group relative rounded-2xl border transition-all duration-300 animate-slide-up overflow-hidden"
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'both',
        background: completed ? 'rgba(200,255,0,0.04)' : locked ? 'rgba(10,10,15,0.5)' : pc.bg,
        borderColor: completed ? 'rgba(200,255,0,0.2)' : locked ? 'rgba(61,61,92,0.4)' : pc.border,
        opacity: locked && !completed ? 0.7 : 1,
      }}
    >
      {/* Priority stripe */}
      {!locked && !completed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: pc.color }} />
      )}

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleComplete}
            disabled={locked || completed}
            className="mt-0.5 flex-shrink-0 transition-all"
            title={completed ? 'Completed' : locked ? 'Locked' : 'Mark complete'}
          >
            {completed ? (
              <CheckCircle2 size={20} style={{ color: '#C8FF00' }} />
            ) : locked ? (
              <Lock size={18} style={{ color: '#606089' }} />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-ink-500 group-hover:border-volt transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`font-body text-sm font-medium leading-snug ${completed ? 'line-through text-ink-400' : 'text-white'}`}>
              {task.title}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`badge ${pc.badge}`}>{task.priority}</span>
              {completed && <span className="badge badge-completed">Done</span>}
              {locked && !completed && <span className="badge badge-locked"><Lock size={9}/> Locked</span>}
              {!locked && !completed && timeInfo.urgent && (
                <span className="badge" style={{ background:'rgba(255,107,107,0.12)', color:'#FF6B6B', border:'1px solid rgba(255,107,107,0.3)' }}>
                  <AlertTriangle size={9}/> {timeInfo.text}
                </span>
              )}
              {!locked && !completed && !timeInfo.urgent && (
                <span className="text-ink-500 text-xs flex items-center gap-1 font-body">
                  <Clock size={10}/> {timeInfo.text}
                </span>
              )}
              {completed && task.completedAt && (
                <span className="text-ink-500 text-xs font-body">
                  at {formatDate(task.completedAt, { timeOnly: true })}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {!locked && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              {!completed && (
                <button onClick={handleEdit} className="p-1.5 rounded-lg text-ink-400 hover:text-volt hover:bg-volt/10 transition-all">
                  <Edit3 size={14}/>
                </button>
              )}
              <button onClick={handleDelete} className="p-1.5 rounded-lg text-ink-400 hover:text-coral hover:bg-coral/10 transition-all">
                <Trash2 size={14}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default TaskCard
