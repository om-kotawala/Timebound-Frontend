import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { ArrowRight, Briefcase, GraduationCap, Mail, Target, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import AuthMessage from '../components/auth/AuthMessage'
import Spinner from '../components/ui/Spinner'
import { ROLES } from '../constants'

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email address'),
  occupation: z.string().trim().min(2, 'Occupation must be at least 2 characters').max(80, 'Occupation is too long'),
  role: z.enum(ROLES),
  monthlyGoal: z.coerce.number().min(0, 'Monthly goal must be 0 or more').max(100, 'Monthly goal cannot exceed 100'),
})

const RegisterPage = () => {
  const { loading, error, handleRegister, clearError } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    occupation: '',
    role: 'Student',
    monthlyGoal: '30',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    setFormErrors({})
    clearError()
  }, [form, clearError])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const parsed = registerSchema.safeParse(form)

    if (!parsed.success) {
      setFormErrors(parsed.error.flatten().fieldErrors)
      return
    }

    setFormErrors({})
    await handleRegister(parsed.data)
  }

  return (
    <AuthLayout
      eyebrow="Create Account"
      title="Register for TimeBound"
      description="Create your account first, then log in with your email OTP to access the app."
      footer={
        <p className="text-sm text-ink-500">
          Already registered?{' '}
          <Link to="/login" className="text-volt-300 hover:text-volt">
            Go to login
          </Link>
        </p>
      }
    >
      {error && <AuthMessage tone="error">{error}</AuthMessage>}
      <AuthMessage tone="info">
        Registration stores your user in the database, then sends you to the login page.
      </AuthMessage>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          icon={User}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          error={formErrors.name?.[0]}
          autoFocus
        />

        <AuthInput
          icon={Mail}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={formErrors.email?.[0]}
        />

        <AuthInput
          icon={Briefcase}
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          placeholder="Occupation"
          error={formErrors.occupation?.[0]}
        />

        <div>
          <label className="flex items-center gap-2 text-xs text-ink-400 uppercase tracking-widest mb-2 font-display">
            <GraduationCap size={12} />
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input-field"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {formErrors.role?.[0] && <p className="text-xs text-coral mt-1">{formErrors.role[0]}</p>}
        </div>

        <AuthInput
          icon={Target}
          type="number"
          name="monthlyGoal"
          value={form.monthlyGoal}
          onChange={handleChange}
          placeholder="80"
          min={0}
          max={100}
          error={formErrors.monthlyGoal?.[0]}
        />

        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
          {loading ? <Spinner size={16} color="rgb(var(--accent-contrast))" /> : <>Register <ArrowRight size={16} /></>}
        </button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
