
import React, { memo } from 'react'
import { getProgressColor } from '../../utils'

const ProgressRing = memo(({ pct = 0, size = 120, stroke = 10, label, sublabel }) => {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = getProgressColor(pct)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgb(var(--volt-300) / 0.06)" strokeWidth={stroke} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            className="progress-ring transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-extrabold text-2xl" style={{ color }}>{pct}%</span>
          {label && <span className="text-xs text-ink-300 mt-0.5">{label}</span>}
        </div>
      </div>
      {sublabel && <p className="text-xs text-ink-400 text-center">{sublabel}</p>}
    </div>
  )
})

export default ProgressRing
