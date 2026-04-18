import React from 'react'
import { Shield, Zap, CalendarDays, Target } from 'lucide-react'

const FEATURES = [
  { icon: Zap, title: 'Deadline-first planning', description: 'Prioritize tasks, complete them fast, and keep your day moving.' },
  { icon: CalendarDays, title: 'Track your history', description: 'Review what you finished on previous days from one place.' },
  { icon: Target, title: 'Progress visibility', description: 'See how your consistency stacks up across days and months.' },
  { icon: Shield, title: 'Protected access', description: 'Only registered users with a verified OTP can enter the app.' },
]

const AuthHero = () => (
  <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden p-12">
    <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
    <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgb(var(--volt-300) / 0.08)' }} />
    <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full blur-3xl" style={{ background: 'rgb(var(--sky-task) / 0.05)' }} />

    <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
      <div className="mb-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 animate-pulse-volt" style={{ background: 'rgb(var(--volt-300))' }}>
          <Zap size={26} color="rgb(var(--accent-contrast))" strokeWidth={3} />
        </div>
        <h2 className="text-5xl font-display text-ink-50 leading-tight mb-4 font-extrabold">
          Bound by time.<br />
          <span className="text-gradient">Freed by focus.</span>
        </h2>
        <p className="text-lg text-ink-400 leading-relaxed">
          TimeBound keeps task entry, progress tracking, and login access in one focused workflow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="p-4 rounded-2xl"
            style={{ background: 'rgb(var(--volt-300) / 0.04)', border: '1px solid rgb(var(--volt-300) / 0.08)' }}
          >
            <Icon size={18} className="text-volt-300 mb-3" />
            <p className="text-sm text-ink-100 mb-1 font-display font-bold">{title}</p>
            <p className="text-xs text-ink-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default AuthHero
