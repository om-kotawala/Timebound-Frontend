
import React, { memo, useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = memo(({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgb(15 23 42 / 0.48)' }} />
      <div
        className="relative w-full max-w-md glass rounded-2xl p-6 animate-slide-up"
        style={{ border: '1px solid rgb(var(--border-highlight) / 0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-700 text-ink-100">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-ink-400 hover:text-ink-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
})

export default Modal
