import React from 'react'
import ProgressRing from '../ui/ProgressRing'

const HistorySummary = ({ selectedDateLabel, taskCount, progress, stats }) => (
  <>
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-ink-50">
          {selectedDateLabel}
        </h2>
        <p className="text-sm text-ink-400">
          {taskCount} task{taskCount !== 1 ? 's' : ''} recorded
        </p>
      </div>
      {taskCount > 0 && <ProgressRing pct={progress} size={80} stroke={7} />}
    </div>

    {taskCount > 0 && (
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl text-center" style={{ background: 'rgb(var(--surface-card) / 0.72)', border: `1px solid ${stat.color}15` }}>
            <div className="text-2xl font-display font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    )}
  </>
)

export default HistorySummary
