import React, { memo, useMemo } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { selectTheme, toggleTheme } from '../../store/slices/uiSlice'

const PAGE_META = {
  '/': { label: 'Dashboard', description: 'Stay on top of today\'s priorities' },
  '/calendar': { label: 'Calendar', description: 'Review your task history by date' },
  '/progress': { label: 'Progress', description: 'Measure consistency across time' },
  '/profile': { label: 'Profile', description: 'Manage your account details' },
}

const Topbar = memo(() => {
  const dispatch = useDispatch()
  const location = useLocation()
  const theme = useSelector(selectTheme)

  const pageMeta = useMemo(
    () => PAGE_META[location.pathname] || { label: 'TimeBound', description: 'Smart task tracking' },
    [location.pathname]
  )

  const isDarkTheme = theme === 'dark'

  return (
    <header className="sticky top-0 z-30 mb-8">
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
        style={{
          background: 'rgb(var(--sidebar-bg) / 0.78)',
          border: '1px solid rgb(var(--border-highlight) / 0.12)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 30px rgb(var(--shadow-color) / 0.08)',
        }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ink-400 font-display mb-1">Workspace</p>
          <div className="text-lg text-ink-50 font-display font-semibold">{pageMeta.label}</div>
          <p className="text-sm text-ink-400">{pageMeta.description}</p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
          style={{
            background: isDarkTheme ? 'rgb(var(--volt-300) / 0.14)' : 'rgb(var(--ink-700) / 0.75)',
            border: `1px solid ${isDarkTheme ? 'rgb(var(--volt-300) / 0.28)' : 'rgb(var(--ink-600) / 0.95)'}`,
            color: isDarkTheme ? 'rgb(var(--volt-300))' : 'rgb(var(--ink-100))',
          }}
        >
          {isDarkTheme ? <SunMedium size={16} /> : <MoonStar size={16} />}
          {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>
    </header>
  )
})

export default Topbar
