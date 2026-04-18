import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  selectAuth,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthStep,
  selectPendingEmail,
  register,
  sendOTP,
  verifyOTP,
  logout,
  setStep,
  setPendingEmail,
  clearError,
} from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(selectAuth)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const step = useSelector(selectAuthStep)
  const pendingEmail = useSelector(selectPendingEmail)

  const handleRegister = useCallback(async (data) => {
    const result = await dispatch(register(data))
    if (register.fulfilled.match(result)) {
      toast.success('Registration complete. Please log in to continue.')
      navigate('/login', { replace: true, state: { email: data.email } })
      return true
    }
    toast.error(result.payload || 'Failed')
    return false
  }, [dispatch, navigate])

  const handleSendOTP = useCallback(async (email) => {
    dispatch(setPendingEmail(email))
    const result = await dispatch(sendOTP(email))
    if (sendOTP.fulfilled.match(result)) { toast.success('OTP sent!'); return true }
    toast.error(result.payload || 'Failed')
    return false
  }, [dispatch])

  const handleVerifyOTP = useCallback(async (otp) => {
    const result = await dispatch(verifyOTP({ email: pendingEmail, otp }))
    if (verifyOTP.fulfilled.match(result)) { toast.success('Welcome to TimeBound!'); navigate('/'); return true }
    toast.error(result.payload || 'Invalid OTP')
    return false
  }, [dispatch, pendingEmail, navigate])

  const handleLogout = useCallback(() => {
    dispatch(logout())
    navigate('/login')
  }, [dispatch, navigate])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSetStep = useCallback((value) => {
    dispatch(setStep(value))
  }, [dispatch])

  return {
    auth,
    isAuthenticated,
    loading,
    error,
    step,
    pendingEmail,
    handleRegister,
    handleSendOTP,
    handleVerifyOTP,
    handleLogout,
    clearError: handleClearError,
    setStep: handleSetStep,
  }
}
