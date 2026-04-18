import React from 'react'

const AchievementGrid = ({ items }) => (
  <div className="card">
    <h3 className="text-sm font-display font-bold text-ink-200 uppercase tracking-widest mb-4">Achievements</h3>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, icon, unlocked }) => (
        <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all" style={{
          background: unlocked ? 'rgb(var(--volt-300) / 0.06)' : 'rgb(var(--surface-muted) / 0.72)',
          border: `1px solid ${unlocked ? 'rgb(var(--volt-300) / 0.2)' : 'rgb(var(--ink-300) / 0.08)'}`,
          opacity: unlocked ? 1 : 0.4,
        }}>
          <span className="text-2xl">{icon}</span>
          <span className="text-xs font-medium text-ink-300">{label}</span>
        </div>
      ))}
    </div>
  </div>
)

export default AchievementGrid
