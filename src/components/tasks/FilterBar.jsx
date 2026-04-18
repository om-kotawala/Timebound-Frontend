
import React, { memo } from 'react'
import { Filter } from 'lucide-react'
import { PRIORITIES } from '../../constants'

const FilterBar = memo(({ filter, onFilter, taskTypeOptions = [] }) => {
  const priorityOpts = ['All', ...PRIORITIES]
  const statusOpts = ['All', 'Pending', 'Completed']
  const typeOpts = [{ value: 'All', label: 'All Types' }, ...taskTypeOptions]

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs text-ink-400">
        <Filter size={12} />
        <span className="uppercase tracking-widest font-display">Filter</span>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {typeOpts.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilter({ taskType: option.value })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: filter.taskType === option.value ? 'rgb(var(--volt-300) / 0.12)' : 'rgb(var(--surface-muted) / 0.78)',
              border: `1px solid ${filter.taskType === option.value ? 'rgb(var(--volt-300) / 0.3)' : 'rgb(var(--ink-300) / 0.12)'}`,
              color: filter.taskType === option.value ? 'rgb(var(--volt-300))' : 'rgb(var(--ink-400))',
            }}
          >{option.label}</button>
        ))}
      </div>

      <div className="w-px h-4 bg-ink-700" />

      <div className="flex gap-1.5">
        {priorityOpts.map(p => (
          <button
            key={p}
            onClick={() => onFilter({ priority: p })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: filter.priority === p ? 'rgb(var(--volt-300) / 0.12)' : 'rgb(var(--surface-muted) / 0.78)',
              border: `1px solid ${filter.priority === p ? 'rgb(var(--volt-300) / 0.3)' : 'rgb(var(--ink-300) / 0.12)'}`,
              color: filter.priority === p ? 'rgb(var(--volt-300))' : 'rgb(var(--ink-400))',
            }}
          >{p}</button>
        ))}
      </div>

      <div className="w-px h-4 bg-ink-700" />

      <div className="flex gap-1.5">
        {statusOpts.map(s => (
          <button
            key={s}
            onClick={() => onFilter({ status: s })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: filter.status === s ? 'rgb(var(--volt-300) / 0.12)' : 'rgb(var(--surface-muted) / 0.78)',
              border: `1px solid ${filter.status === s ? 'rgb(var(--volt-300) / 0.3)' : 'rgb(var(--ink-300) / 0.12)'}`,
              color: filter.status === s ? 'rgb(var(--volt-300))' : 'rgb(var(--ink-400))',
            }}
          >{s}</button>
        ))}
      </div>
    </div>
  )
})

export default FilterBar
