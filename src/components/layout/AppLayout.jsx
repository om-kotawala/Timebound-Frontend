
import React, { memo, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = memo(() => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--app-bg))' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 md:left-64 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--border-highlight) / 0.24), transparent)' }}
        />
        <div
          className="absolute top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-10 blur-3xl md:top-20 md:left-80 md:h-96 md:w-96 md:translate-x-0"
          style={{ background: 'rgb(var(--volt-300) / 0.32)' }}
        />
        <div
          className="absolute bottom-10 right-0 h-52 w-52 rounded-full opacity-10 blur-3xl sm:right-8 md:bottom-20 md:right-20 md:h-72 md:w-72"
          style={{ background: 'rgb(var(--sky-task) / 0.22)' }}
        />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="relative z-10 min-h-screen px-4 py-4 sm:px-6 sm:py-6 md:ml-64 md:px-8 md:py-8">
        <Topbar onMenuToggle={() => setSidebarOpen((open) => !open)} isSidebarOpen={sidebarOpen} />
        <Outlet />
      </main>
    </div>
  )
})

export default AppLayout
