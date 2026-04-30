
import React, { memo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, BarChart3, User, LogOut, Clock, Zap, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { formatDate } from '../../utils'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const Sidebar = memo(({ isOpen = false, onClose = () => {} }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const now = new Date()
  const time = formatDate(now, { timeOnly: true })
  const date = formatDate(now, { weekdayShort: true })

  const handleLogout = () => {
    dispatch(logout())
    onClose()
    navigate('/login')
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-[min(18rem,85vw)] flex-col overflow-y-auto transition-transform duration-300 ease-out md:w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
      style={{
        background: 'rgb(var(--sidebar-bg) / 0.95)',
        borderRight: '1px solid rgb(var(--border-highlight) / 0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pb-6 pt-5 md:px-6 md:pt-8">
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl animate-pulse-volt" style={{ background: 'rgb(var(--volt-300))' }}>
              <Zap size={18} color="rgb(var(--accent-contrast))" strokeWidth={3} />
            </div>
            <div>
              <h1 className="font-display text-lg text-ink-50 tracking-tight font-semibold">TimeBound</h1>
              <p className="text-xs text-ink-500">Smart Task Tracker</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink-700/60 text-ink-400 transition-colors hover:text-ink-100 md:hidden"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Clock */}
      <div className="mx-4 mb-6 rounded-xl p-3" style={{ background: 'rgb(var(--volt-300) / 0.06)', border: '1px solid rgb(var(--volt-300) / 0.12)' }}>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-volt-300" />
          <span className="text-xs text-ink-400">{date} IST</span>
        </div>
        <div className="text-2xl font-display font-semibold text-gradient mt-1">{time}</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-ink-900 font-semibold'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgb(var(--volt-300))',
              boxShadow: '0 4px 16px rgb(var(--volt-300) / 0.24)',
            } : undefined}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-ink-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-ink-400 hover:text-coral hover:bg-coral/5 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
})

export default Sidebar
