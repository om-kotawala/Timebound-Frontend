
import React, { memo } from 'react'

const StatCard = memo(({ label, value, icon: Icon, color = '#C8FF00', sublabel }) => (
  <div className="card glass-hover">
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-medium text-ink-400 uppercase tracking-widest font-display">{label}</span>
      {Icon && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '15', border: '1px solid ' + color + '25' }}>
          <Icon size={15} style={{ color }} />
        </div>
      )}
    </div>
    <div className="stat-number">{value}</div>
    {sublabel && <p className="text-xs text-ink-400 mt-1">{sublabel}</p>}
  </div>
))

export default StatCard
