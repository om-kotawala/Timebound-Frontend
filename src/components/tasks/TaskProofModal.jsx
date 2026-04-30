import React, { memo, useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import { formatFileSize } from '../../utils'

const ACCEPTED_PROOF_TYPES = '.png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip'

const TaskProofModal = memo(({
  isOpen,
  mode = 'submit',
  taskTitle = '',
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
      setReason('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (mode === 'submit') {
      if (!selectedFile) return
      const ok = await onSubmit(selectedFile)
      if (ok) onClose()
      return
    }

    if (!reason.trim()) return
    const ok = await onSubmit(reason.trim())
    if (ok) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !loading && onClose()}
      title={mode === 'submit' ? 'Submit Proof' : 'Reject Proof'}
    >
      <div className="space-y-4">
        <p className="text-sm text-ink-400 leading-relaxed">
          {mode === 'submit'
            ? `Upload a proof file for "${taskTitle}" before the assignee can mark it as finished.`
            : `Provide a reason for rejecting the submitted proof for "${taskTitle}".`}
        </p>

        {mode === 'submit' ? (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs text-ink-400 uppercase tracking-widest mb-2 block">Proof File</span>
              <input
                type="file"
                accept={ACCEPTED_PROOF_TYPES}
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                disabled={loading}
                className="input-field file:mr-3 file:rounded-lg file:border-0 file:bg-volt-300/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-volt-300"
              />
            </label>
            <p className="text-xs text-ink-500">
              Accepted formats: images, PDF, Office docs, CSV, TXT, and ZIP.
            </p>
            {selectedFile && (
              <div
                className="rounded-xl p-3 text-sm"
                style={{
                  background: 'rgb(var(--surface-muted) / 0.72)',
                  border: '1px solid rgb(var(--border-highlight) / 0.08)',
                }}
              >
                <p className="font-medium text-ink-100">{selectedFile.name}</p>
                <p className="text-xs text-ink-500 mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="text-xs text-ink-400 uppercase tracking-widest mb-2 block">Rejection Reason</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain what is missing or why this proof is not acceptable."
              disabled={loading}
              rows={5}
              className="input-field resize-none"
            />
            <p className="text-xs text-ink-500 mt-2">A reason is required before the proof can be rejected.</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-ghost flex-1 justify-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || (mode === 'submit' ? !selectedFile : !reason.trim())}
            className="btn-primary flex-1 justify-center"
          >
            {loading ? <Spinner size={16} color="rgb(var(--accent-contrast))" /> : mode === 'submit' ? 'Send for Review' : 'Reject Proof'}
          </button>
        </div>
      </div>
    </Modal>
  )
})

export default TaskProofModal
