import React from 'react'
import { Edit3, Save, X } from 'lucide-react'
import Spinner from '../ui/Spinner'

const ProfileAvatarCard = ({ profile, initials, editing, onEdit, onCancel, onSave, loading }) => (
  <div className="card mb-6 flex items-center gap-5">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-extrabold"
      style={{
        background: 'linear-gradient(135deg, rgb(var(--volt-300) / 0.3), rgb(var(--volt-300) / 0.1))',
        border: '2px solid rgb(var(--volt-300) / 0.3)',
        color: 'rgb(var(--volt-300))',
      }}
    >
      {initials}
    </div>
    <div className="flex-1">
      <h2 className="text-xl font-display font-bold text-ink-50">{profile?.name || 'Unnamed User'}</h2>
      <p className="text-sm text-ink-400">
        {[profile?.role, profile?.occupation].filter(Boolean).join(' / ') || 'No role or occupation set'}
      </p>
    </div>
    {!editing ? (
      <button onClick={onEdit} className="btn-ghost">
        <Edit3 size={15} /> Edit
      </button>
    ) : (
      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-ghost"><X size={15} /></button>
        <button onClick={onSave} className="btn-primary" disabled={loading}>
          {loading ? <Spinner size={14} color="rgb(var(--accent-contrast))" /> : <><Save size={14} /> Save</>}
        </button>
      </div>
    )}
  </div>
)

export default ProfileAvatarCard
