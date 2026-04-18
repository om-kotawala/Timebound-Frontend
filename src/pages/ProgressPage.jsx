import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDailyProgress,
  fetchMonthlyProgress,
  fetchYearlyProgress,
  selectDailyProgress,
  selectMonthlyChartData,
  selectMonthlyProgress,
  selectWeeklyChartData,
  selectYearlyProgress,
} from '../store/slices/progressSlice'
import ProgressOverview from '../components/progress/ProgressOverview'
import ProgressCharts from '../components/progress/ProgressCharts'
import AchievementGrid from '../components/progress/AchievementGrid'
import { formatLocalDateKey } from '../utils'

const ProgressPage = () => {
  const dispatch = useDispatch()
  const daily = useSelector(selectDailyProgress)
  const monthly = useSelector(selectMonthlyProgress)
  const monthlyChartData = useSelector(selectMonthlyChartData)
  const yearly = useSelector(selectYearlyProgress)
  const weeklyData = useSelector(selectWeeklyChartData)

  useEffect(() => {
    const now = new Date()
    const today = formatLocalDateKey(now)

    dispatch(fetchDailyProgress(today))
    dispatch(fetchMonthlyProgress({ month: now.getMonth() + 1, year: now.getFullYear() }))
    dispatch(fetchYearlyProgress(now.getFullYear()))
  }, [dispatch])

  const chartMonthlyData = useMemo(
    () => (monthlyChartData || []).map((item) => ({ name: String(item.day), pct: Math.round(item.pct || 0) })),
    [monthlyChartData]
  )

  const chartWeeklyData = useMemo(
    () => (weeklyData || []).map((item) => ({ name: item.day, pct: item.pct || 0 })),
    [weeklyData]
  )

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="text-xs text-ink-500 uppercase tracking-widest mb-1 font-display">Analytics</p>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-ink-50">
          Your <span className="text-gradient">Progress</span>
        </h1>
        <p className="text-ink-400 mt-1 text-sm">Track your productivity across all timeframes</p>
      </div>

      <ProgressOverview
        items={[
          { label: 'Today', sublabel: `${daily.completed}/${daily.total} tasks`, pct: daily.pct, period: 'Daily' },
          { label: 'This Month', sublabel: `${monthly.daysWithTasks || 0} days tracked`, pct: monthly.pct || 0, period: 'Monthly' },
          { label: 'This Year', sublabel: `${yearly.monthsWithData || 0} months active`, pct: yearly.pct || 0, period: 'Yearly' },
        ]}
      />

      <ProgressCharts weeklyData={chartWeeklyData} monthlyData={chartMonthlyData} />

      <AchievementGrid
        items={[
          { label: 'First Task', icon: 'TG', unlocked: daily.total > 0 },
          { label: 'Half Done', icon: '50', unlocked: daily.pct >= 50 },
          { label: 'All Done', icon: '100', unlocked: daily.pct === 100 && daily.total > 0 },
          { label: 'Consistent', icon: '7D', unlocked: (monthly.daysWithTasks || 0) >= 7 },
        ]}
      />
    </div>
  )
}

export default ProgressPage
