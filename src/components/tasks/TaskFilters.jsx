import { useDispatch, useSelector } from 'react-redux'
import { setFilter, clearFilters } from '../../store/slices/tasksSlice'
import { PRIORITIES } from '../../constants'
import { Filter, X } from 'lucide-react'

export default function TaskFilters() {
  const dispatch = useDispatch()
  const filters = useSelector(s => s.tasks.filters)
  const isFiltered = filters.priority !== 'All' || filters.status !== 'All'

  const FilterBtn = ({ group, value, label }) => {
    const active = filters[group] === value
    return (
      <button
        onClick={() => dispatch(setFilter({ [group]: value }))}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all"
        style={{
          background: active ? 'rgba(200,255,0,0.15)' : 'transparent',
          color: active ? '#C8FF00' : '#606089',
          border: active ? '1px solid rgba(200,255,0,0.3)' : '1px solid transparent',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <Filter size={13} className="text-ink-400"/>
        <span className="text-ink-400 text-xs uppercase tracking-widest">Filter:</span>
      </div>
      <div className="flex flex-wrap gap-1">
        <FilterBtn group="priority" value="All" label="All" />
        {PRIORITIES.map(p => <FilterBtn key={p} group="priority" value={p} label={p} />)}
      </div>
      <div className="w-px h-4 bg-ink-700" />
      <div className="flex gap-1">
        <FilterBtn group="status" value="All" label="All Status" />
        <FilterBtn group="status" value="Pending" label="Pending" />
        <FilterBtn group="status" value="Completed" label="Completed" />
      </div>
      {isFiltered && (
        <button onClick={() => dispatch(clearFilters())} className="flex items-center gap-1 text-xs text-coral hover:text-coral/80 transition-colors ml-auto">
          <X size={12}/> Clear
        </button>
      )}
    </div>
  )
}
