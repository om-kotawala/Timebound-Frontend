import React, { useState, useMemo } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import ProfileAvatarCard from '../components/profile/ProfileAvatarCard'
import ProfileFieldsCard from '../components/profile/ProfileFieldsCard'
import ProfileSettingsCard from '../components/profile/ProfileSettingsCard'

const ProfilePage = () => {
  const { profile, loading, handleUpdate } = useProfile()
  const { handleLogout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', occupation: '', monthlyGoal: 80 })

  const handleEdit = () => {
    setForm({
      name: profile?.name || '',
      occupation: profile?.occupation || '',
      monthlyGoal: profile?.monthlyGoal ?? 80,
    })
    setEditing(true)
  }

  const handleChange = (event) => {
    const { name, value, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'number' ? Number(value) : value }))
  }

  const handleSave = async () => {
    const ok = await handleUpdate(form)
    if (ok) setEditing(false)
  }

  const initials = useMemo(() => {
    const name = profile?.name?.trim() || 'User'
    return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  }, [profile?.name])

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <p className="text-xs text-ink-500 uppercase tracking-widest mb-1 font-display">Account</p>
        <h1 className="text-4xl font-display font-extrabold text-ink-50">
          My <span className="text-gradient">Profile</span>
        </h1>
      </div>

      <ProfileAvatarCard
        profile={profile}
        initials={initials}
        editing={editing}
        onEdit={handleEdit}
        onCancel={() => setEditing(false)}
        onSave={handleSave}
        loading={loading}
      />

      <ProfileFieldsCard profile={profile} editing={editing} form={form} onChange={handleChange} />
      <ProfileSettingsCard onLogout={handleLogout} />
    </div>
  )
}

export default ProfilePage
