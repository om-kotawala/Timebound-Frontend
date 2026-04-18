import { useDispatch, useSelector } from 'react-redux'
import { deleteTask } from '../../store/slices/tasksSlice'
import { setConfirmDelete } from '../../store/slices/uiSlice'
import Modal from '../ui/Modal'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteConfirmModal() {
  const dispatch = useDispatch()
  const taskId = useSelector(s => s.ui.confirmDelete)
  const [loading, setLoading] = useState(false)

  const handleClose = () => dispatch(setConfirmDelete(null))
  const handleConfirm = async () => {
    setLoading(true)
    await dispatch(deleteTask(taskId))
    setLoading(false)
    handleClose()
  }

  return (
    <Modal open={!!taskId} onClose={handleClose} title="Delete Task">
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)' }}>
            <AlertTriangle size={18} style={{ color: '#FF6B6B' }}/>
          </div>
          <p className="text-ink-300 text-sm font-body leading-relaxed">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleConfirm} className="btn-danger flex-1 justify-center py-2.5 rounded-xl" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin"/> : null}
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
