import React from 'react'
import { CalendarDays, CheckCircle2, Circle } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import Spinner from '../ui/Spinner'
import TaskCard from '../ui/TaskCard'

const HistoryTaskGroups = ({ loading, tasks, completed, pending }) => {
  if (loading) {
    return <div className="flex justify-center py-8"><Spinner /></div>
  }

  if (tasks.length === 0) {
    return <EmptyState icon={CalendarDays} title="No tasks this day" description="No tasks were recorded on this date." />
  }

  return (
    <div className="space-y-4">
      {completed.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-xs font-display font-bold text-volt-300 uppercase tracking-widest mb-2">
            <CheckCircle2 size={13} /> Completed ({completed.length})
          </h3>
          <div className="space-y-2">
            {completed.map((task) => <TaskCard key={task._id} task={task} readonly />)}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-xs font-display font-bold text-ink-400 uppercase tracking-widest mb-2">
            <Circle size={13} /> Not Completed ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map((task) => <TaskCard key={task._id} task={task} readonly />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryTaskGroups
