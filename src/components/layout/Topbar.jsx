import React, { memo, useMemo } from 'react'
import { Menu, MoonStar, SunMedium } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { selectTheme, toggleTheme } from '../../store/slices/uiSlice'

const PAGE_META = {
  '/': { label: 'Dashboard', description: 'Stay on top of today\'s priorities' },
  '/calendar': { label: 'Calendar', description: 'Review your task history by date' },
  '/progress': { label: 'Progress', description: 'Measure consistency across time' },
  '/profile': { label: 'Profile', description: 'Manage your account details' },
}

const Topbar = memo(({ onMenuToggle, isSidebarOpen }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const theme = useSelector(selectTheme)

  const pageMeta = useMemo(
    () => PAGE_META[location.pathname] || { label: 'TimeBound', description: 'Smart task tracking' },
    [location.pathname]
  )

  const isDarkTheme = theme === 'dark'

  return (
    <header className="sticky top-0 z-30 mb-6 sm:mb-8">
      <div
        className="flex flex-col gap-4 rounded-2xl px-4 py-4 sm:px-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: 'rgb(var(--sidebar-bg) / 0.78)',
          border: '1px solid rgb(var(--border-highlight) / 0.12)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 30px rgb(var(--shadow-color) / 0.08)',
        }}
      >
        <div className="flex items-start gap-3 sm:items-center">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-ink-700/60 text-ink-300 transition-colors hover:text-ink-100 md:hidden"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.24em] text-ink-400 font-display">Workspace</p>
            <div className="text-base sm:text-lg text-ink-50 font-display font-semibold">{pageMeta.label}</div>
            <p className="text-sm text-ink-400">{pageMeta.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:w-auto"
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
