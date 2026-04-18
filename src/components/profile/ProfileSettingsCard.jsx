import React from 'react'
import { Bell, ChevronRight, LogOut, Shield } from 'lucide-react'

const SETTINGS = [
  { icon: Shield, label: 'Privacy & Security', sublabel: 'OTP-based, no passwords stored' },
  { icon: Bell, label: 'Email Notifications', sublabel: 'Deadline warnings and daily reports' },
]

const ProfileSettingsCard = ({ onLogout }) => (
  <div className="card">
    <h3 className="text-xs font-display font-bold text-ink-400 uppercase tracking-widest mb-3">Settings</h3>
    <div className="space-y-1">
      {SETTINGS.map(({ icon: Icon, label, sublabel }) => (
        <div key={label} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgb(var(--ink-300) / 0.08)' }}>
            <Icon size={14} className="text-ink-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-ink-200">{label}</p>
            <p className="text-xs text-ink-500">{sublabel}</p>
          </div>
          <ChevronRight size={14} className="text-ink-600 group-hover:text-ink-400 transition-colors" />
        </div>
      ))}
      <button onClick={onLogout} className="flex items-center gap-4 p-3 rounded-xl hover:bg-coral/5 cursor-pointer transition-colors group w-full text-left">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgb(var(--coral-default) / 0.08)' }}>
          <LogOut size={14} className="text-coral" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-coral">Sign Out</p>
          <p className="text-xs text-ink-500">End your current session</p>
        </div>
      </button>
    </div>
  </div>
)

export default ProfileSettingsCard
