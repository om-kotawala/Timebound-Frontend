import React from 'react'
import { Award, BarChart3, Calendar } from 'lucide-react'
import ProgressRing from '../ui/ProgressRing'

const ICONS = {
  Today: Calendar,
  'This Month': BarChart3,
  'This Year': Award,
}

const ProgressOverview = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {items.map(({ label, sublabel, pct, period }) => {
      const Icon = ICONS[label]
      return (
        <div key={label} className="card flex items-center gap-6 glass-hover">
          <ProgressRing pct={pct} size={96} stroke={8} />
          <div>
            <div className="flex items-center gap-2 text-xs text-ink-500 uppercase tracking-widest mb-1 font-display">
              {Icon && <Icon size={12} />}
              {period}
            </div>
            <div className="text-lg font-display font-bold text-ink-100 mb-0.5">{label}</div>
            <div className="text-xs text-ink-400">{sublabel}</div>
          </div>
        </div>
      )
    })}
  </div>
)

export default ProgressOverview
