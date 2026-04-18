import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { KeyRound, Mail, ArrowRight, ChevronLeft, Shield } from 'lucide-react'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import AuthMessage from '../components/auth/AuthMessage'
import Spinner from '../components/ui/Spinner'

const loginEmailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})

const loginOtpSchema = z.object({
  otp: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
})

const LoginPage = () => {
  const location = useLocation()
  const { loading, error, step, pendingEmail, handleSendOTP, handleVerifyOTP, clearError, setStep } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    }
  }, [location.state])

  useEffect(() => {
    setFormErrors({})
    clearError()
  }, [email, otp, clearError])

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    const parsed = loginEmailSchema.safeParse({ email })

    if (!parsed.success) {
      setFormErrors(parsed.error.flatten().fieldErrors)
      return
    }

    setFormErrors({})
    await handleSendOTP(parsed.data.email)
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    const parsed = loginOtpSchema.safeParse({ otp })

    if (!parsed.success) {
      setFormErrors(parsed.error.flatten().fieldErrors)
      return
    }

    setFormErrors({})
    await handleVerifyOTP(parsed.data.otp)
  }

  return (
    <AuthLayout
      eyebrow="Member Access"
      title={step === 'otp' ? 'Verify your login code' : 'Log in to TimeBound'}
      description={
        step === 'otp'
          ? `We sent a 6-digit OTP to ${pendingEmail}.`
          : 'Use your registered email to receive a one-time login code.'
      }
      footer={
        <p className="text-sm text-ink-500">
          Need an account?{' '}
          <Link to="/register" className="text-volt-300 hover:text-volt">
            Create one here
          </Link>
        </p>
      }
    >
      {error && <AuthMessage tone="error">{error}</AuthMessage>}

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <AuthInput
            icon={Mail}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            error={formErrors.email?.[0]}
            autoFocus
          />

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? <Spinner size={16} color="rgb(var(--accent-contrast))" /> : <>Send OTP <ArrowRight size={16} /></>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <AuthMessage tone="info">
            <span className="inline-flex items-center gap-2">
              <Shield size={14} />
              Login is allowed only after successful OTP verification.
            </span>
          </AuthMessage>

          <AuthInput
            icon={KeyRound}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            error={formErrors.otp?.[0]}
            maxLength={6}
            autoFocus
            inputMode="numeric"
            className="text-center text-xl tracking-[0.5em] font-display"
          />

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? <Spinner size={16} color="rgb(var(--accent-contrast))" /> : <>Verify OTP <ArrowRight size={16} /></>}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('email')
              setOtp('')
              setFormErrors({})
            }}
            className="btn-ghost w-full justify-center"
          >
            <ChevronLeft size={15} /> Use another email
          </button>
        </form>
      )}
    </AuthLayout>
  )
}

export default LoginPage
