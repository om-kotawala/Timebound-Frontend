
import React, { memo, useState, useEffect, useCallback } from 'react'
import { PRIORITIES, PRIORITY_CONFIG } from '../../constants'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'

const EditTaskModal = memo(({ task, isOpen, onClose, onSave, loading }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')

  useEffect(() => {
    if (task) { setTitle(task.title); setPriority(task.priority) }
  }, [task])

  const handleSave = useCallback(async () => {
    if (!title.trim()) return
    const ok = await onSave(task._id, { title: title.trim(), priority })
    if (ok) onClose()
  }, [task, title, priority, onSave, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-ink-400 uppercase tracking-widest mb-2 block">Title</label>
          <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} maxLength={200} />
        </div>
        <div>
          <label className="text-xs text-ink-400 uppercase tracking-widest mb-2 block">Priority</label>
          <div className="flex gap-2">
            {PRIORITIES.map(p => {
              const cfg = PRIORITY_CONFIG[p]
              return (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{
                    background: priority === p ? cfg.bg : 'rgb(var(--surface-muted) / 0.78)',
                    border: `1px solid ${priority === p ? cfg.border : 'rgb(var(--ink-300) / 0.12)'}`,
                    color: priority === p ? cfg.color : 'rgb(var(--ink-400))',
                  }}
                >{p}</button>
              )
            })}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center" disabled={loading || !title.trim()}>
            {loading ? <Spinner size={16} color="rgb(var(--accent-contrast))" /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
})

export default EditTaskModal
