import React, { memo, Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCurrentUser,
  selectAuthInitialized,
  selectIsAuthenticated,
} from './store/slices/authSlice'
import { selectTheme } from './store/slices/uiSlice'
import AppLayout from './components/layout/AppLayout'
import Spinner from './components/ui/Spinner'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--app-bg))' }}>
    <Spinner size={36} />
  </div>
)

const PrivateRoute = memo(({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const initialized = useSelector(selectAuthInitialized)

  if (!initialized) return <Loading />

  return isAuthenticated ? children : <Navigate to="/login" replace />
})

const PublicRoute = memo(({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const initialized = useSelector(selectAuthInitialized)

  if (!initialized) return <Loading />

  return isAuthenticated ? <Navigate to="/" replace /> : children
})

const App = () => {
  const dispatch = useDispatch()
  const initialized = useSelector(selectAuthInitialized)
  const theme = useSelector(selectTheme)

  useEffect(() => {
    if (!initialized && localStorage.getItem('tb_token')) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, initialized])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('tb_theme', theme)
  }, [theme])

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
