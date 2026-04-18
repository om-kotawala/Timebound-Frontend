import React from 'react'
import { Zap } from 'lucide-react'
import AuthHero from './AuthHero'

const AuthLayout = ({ eyebrow, title, description, children, footer }) => (
  <div className="min-h-screen flex" style={{ background: 'rgb(var(--app-bg))' }}>
    <AuthHero />

    <div className="flex-shrink-0 w-full lg:w-[460px] flex flex-col items-center justify-center p-8 relative" style={{ borderLeft: '1px solid rgb(var(--border-highlight) / 0.08)' }}>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgb(var(--volt-300))' }}>
            <Zap size={18} color="rgb(var(--accent-contrast))" strokeWidth={3} />
          </div>
          <span className="text-xl text-ink-50 font-display font-extrabold">TimeBound</span>
        </div>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500 mb-3 font-display">{eyebrow}</p>
          <h1 className="text-3xl text-ink-50 mb-2 font-display font-extrabold">{title}</h1>
          <p className="text-sm text-ink-400">{description}</p>
        </div>

        <div className="space-y-4">
          {children}
        </div>

        {footer && <div className="mt-8 pt-6 border-t border-ink-800/60">{footer}</div>}
      </div>
    </div>
  </div>
)

export default AuthLayout
