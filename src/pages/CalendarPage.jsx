import React, { useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CalendarDays } from 'lucide-react'
import {
  selectAllTasks,
  fetchTasksByDate,
  selectHistoryTasks,
  selectTasksLoading,
} from '../store/slices/tasksSlice'
import { getDatesWithTasks, formatDate, calcProgress, sortByPriority, formatLocalDateKey } from '../utils'
import EmptyState from '../components/ui/EmptyState'
import CalendarPanel from '../components/calender/CalendarPanel'
import HistorySummary from '../components/calender/HistorySummary'
import HistoryTaskGroups from '../components/calender/HistoryTaskGroups'

const CalendarPage = () => {
  const dispatch = useDispatch()
  const allTasks = useSelector(selectAllTasks)
  const historyTasks = useSelector(selectHistoryTasks)
  const loading = useSelector(selectTasksLoading)
  const [selectedDate, setSelectedDate] = useState(null)

  const datesWithTasks = useMemo(() => getDatesWithTasks(allTasks), [allTasks])

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date)
    const dateStr = formatLocalDateKey(date)
    dispatch(fetchTasksByDate(dateStr))
  }, [dispatch])

  const tileClassName = useCallback(({ date }) => {
    const key = formatLocalDateKey(date)
    return datesWithTasks[key] ? 'has-tasks' : null
  }, [datesWithTasks])

  const displayTasks = useMemo(() => sortByPriority(historyTasks), [historyTasks])
  const progress = useMemo(() => calcProgress(displayTasks), [displayTasks])
  const completed = useMemo(() => displayTasks.filter((task) => task.status === 'Completed'), [displayTasks])
  const pending = useMemo(() => displayTasks.filter((task) => task.status !== 'Completed'), [displayTasks])

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <p className="text-xs text-ink-500 uppercase tracking-widest mb-1 font-display">History & Tracking</p>
        <h1 className="text-4xl font-display font-extrabold text-ink-50">
          Task <span className="text-gradient">Calendar</span>
        </h1>
        <p className="text-ink-400 mt-1 text-sm">Click any date to view your task history</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <CalendarPanel selectedDate={selectedDate} onChange={handleDateChange} tileClassName={tileClassName} />

        <div className="space-y-4">
          {!selectedDate ? (
            <div className="card h-full flex items-center justify-center" style={{ minHeight: '300px' }}>
              <EmptyState
                icon={CalendarDays}
                title="Select a date"
                description="Click on any date in the calendar to view tasks from that day."
              />
            </div>
          ) : (
            <>
              <HistorySummary
                selectedDateLabel={formatDate(selectedDate, { short: false })}
                taskCount={displayTasks.length}
                progress={progress}
                stats={[
                  { label: 'Total', value: displayTasks.length, color: '#9494BA' },
                  { label: 'Completed', value: completed.length, color: '#C8FF00' },
                  { label: 'Pending', value: pending.length, color: '#FFB347' },
                ]}
              />

              <HistoryTaskGroups loading={loading} tasks={displayTasks} completed={completed} pending={pending} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
