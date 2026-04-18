
import React, { memo } from 'react'

const EmptyState = memo(({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-ink-700/50 flex items-center justify-center mb-4 border border-ink-600/30">
        <Icon size={28} className="text-ink-400" />
      </div>
    )}
    <h3 className="text-lg font-display font-600 text-ink-200 mb-2">{title}</h3>
    {description && <p className="text-sm text-ink-400 max-w-xs leading-relaxed mb-4">{description}</p>}
    {action}
  </div>
))

export default EmptyState
