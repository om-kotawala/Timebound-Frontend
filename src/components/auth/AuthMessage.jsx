import React from 'react'

const TONE_STYLES = {
  error: {
    background: 'rgb(var(--coral-default) / 0.08)',
    border: '1px solid rgb(var(--coral-default) / 0.22)',
    color: 'rgb(var(--coral-light))',
  },
  info: {
    background: 'rgb(var(--volt-300) / 0.06)',
    border: '1px solid rgb(var(--volt-300) / 0.14)',
    color: 'rgb(var(--volt-200))',
  },
}

const AuthMessage = ({ tone = 'info', children }) => (
  <div
    className="rounded-xl px-4 py-3 text-sm"
    style={TONE_STYLES[tone]}
  >
    {children}
  </div>
)

export default AuthMessage
