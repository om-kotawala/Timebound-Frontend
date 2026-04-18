
import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = memo(() => (
  <div className="min-h-screen" style={{ background: 'rgb(var(--app-bg))' }}>
    {/* Ambient background */}
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 left-64 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--border-highlight) / 0.24), transparent)' }} />
      <div className="absolute top-20 left-80 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'rgb(var(--volt-300) / 0.32)' }} />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: 'rgb(var(--sky-task) / 0.22)' }} />
    </div>

    <Sidebar />
    <main className="ml-64 min-h-screen p-8 relative z-10">
      <Topbar />
      <Outlet />
    </main>
  </div>
))

export default AppLayout
