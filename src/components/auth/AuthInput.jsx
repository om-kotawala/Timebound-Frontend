import React from 'react'

const AuthInput = ({ icon: Icon, error, className = '', ...props }) => (
  <div>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />}
      <input
        {...props}
        className={`input-field ${Icon ? 'pl-11' : ''} ${className}`.trim()}
      />
    </div>
    {error && (
      <p className="mt-2 text-xs text-coral">
        {error}
      </p>
    )}
  </div>
)

export default AuthInput
