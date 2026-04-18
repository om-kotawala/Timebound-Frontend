import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'

export default function Layout() {
  const open = useSelector(s => s.ui.sidebarOpen)
  return (
    <div className="flex h-screen overflow-hidden bg-ink-900">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: open ? '260px' : '72px' }}
      >
        <div className="min-h-full p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
