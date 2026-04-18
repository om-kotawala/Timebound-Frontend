
import React, { memo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, BarChart3, User, LogOut, Clock, Zap } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const Sidebar = memo(() => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col"
      style={{
        background: 'rgb(var(--sidebar-bg) / 0.95)',
        borderRight: '1px solid rgb(var(--border-highlight) / 0.08)',
        backdropFilter: 'blur(20px)',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-volt" style={{ background: 'rgb(var(--volt-300))' }}>
            <Zap size={18} color="rgb(var(--accent-contrast))" strokeWidth={3} />
          </div>
          <div>
            <h1 className="font-display text-lg text-ink-50 tracking-tight font-semibold">TimeBound</h1>
            <p className="text-xs text-ink-500">Smart Task Tracker</p>
          </div>
        </div>
      </div>

      {/* Clock */}
      <div className="mx-4 mb-6 p-3 rounded-xl" style={{ background: 'rgb(var(--volt-300) / 0.06)', border: '1px solid rgb(var(--volt-300) / 0.12)' }}>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-volt-300" />
          <span className="text-xs text-ink-400">{date}</span>
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
