import React, { memo } from 'react'
import { Briefcase, GraduationCap, Mail, Target, User } from 'lucide-react'

const Field = memo(({ icon: Icon, label, value, editing, name, onChange, disabled, type = 'text', min, max }) => (
  <div
    className="flex items-start gap-4 p-4 rounded-xl transition-all"
    style={{
      background: editing ? 'rgb(var(--volt-300) / 0.03)' : 'transparent',
      border: `1px solid ${editing ? 'rgb(var(--volt-300) / 0.1)' : 'transparent'}`,
    }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: 'rgb(var(--volt-300) / 0.08)', border: '1px solid rgb(var(--volt-300) / 0.12)' }}
    >
      <Icon size={15} className="text-volt-300" />
    </div>
    <div className="flex-1 min-w-0">
      <label className="text-xs text-ink-500 uppercase tracking-widest mb-1.5 block font-display">{label}</label>
      {editing && !disabled ? (
        <input
          className="input-field py-2 px-3 text-sm"
          name={name}
          value={value ?? ''}
          onChange={onChange}
          type={type}
          min={min}
          max={max}
          style={{ borderRadius: '10px' }}
        />
      ) : (
        <p className={`text-sm ${disabled ? 'text-ink-500' : 'text-ink-100'} font-medium`}>
          {value === 0 || value ? value : <span className="text-ink-600 italic">Not set</span>}
          {disabled && <span className="ml-2 text-xs text-ink-600">(read-only)</span>}
        </p>
      )}
    </div>
  </div>
))

const ProfileFieldsCard = ({ profile, editing, form, onChange }) => (
  <div className="card mb-6">
    <h3 className="text-xs font-display font-bold text-ink-400 uppercase tracking-widest mb-3">Personal Info</h3>
    <div className="space-y-1 divide-y divide-ink-800/30">
      <Field icon={User} label="Full Name" value={editing ? form.name : profile?.name} editing={editing} name="name" onChange={onChange} />
      <Field icon={Mail} label="Email" value={profile?.email} editing={editing} disabled name="email" />
      <Field icon={GraduationCap} label="Role" value={profile?.role} editing={editing} disabled name="role" />
      <Field icon={Briefcase} label="Occupation" value={editing ? form.occupation : profile?.occupation} editing={editing} name="occupation" onChange={onChange} />
      <Field icon={Target} label="Monthly Goal (%)" value={editing ? form.monthlyGoal : profile?.monthlyGoal} editing={editing} name="monthlyGoal" onChange={onChange} type="number" min={0} max={100} />
    </div>
  </div>
)

export default ProfileFieldsCard
