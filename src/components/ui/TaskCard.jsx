
import React, { memo, useState, useCallback } from 'react'
import {
  Check,
  Pencil,
  Trash2,
  Lock,
  Clock,
  AlertTriangle,
  Send,
  UserRound,
  FileText,
  FileUp,
  ShieldCheck,
  ShieldX,
  BadgeCheck,
} from 'lucide-react'
import { PRIORITY_CONFIG } from '../../constants'
import { getTimeRemaining, formatDate, formatFileSize, isTaskLocked } from '../../utils'
import TaskProofModal from '../tasks/TaskProofModal'

const TagBadge = ({ label }) => (
  <span
    className="px-2 py-1 rounded-full uppercase tracking-wide"
    style={{
      background: 'rgb(var(--volt-300) / 0.08)',
      border: '1px solid rgb(var(--volt-300) / 0.12)',
      color: 'rgb(var(--volt-300))',
      fontSize: '10px',
    }}
  >
    {label}
  </span>
)

const TaskCard = memo(({
  task,
  onComplete,
  onSubmitProof,
  onApproveProof,
  onRejectProof,
  onEdit,
  onDelete,
  loading = false,
  readonly = false,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const locked = task.isLocked || isTaskLocked(task.deadline)
  const done = task.status === 'Completed'
  const cfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium
  const timeLeft = getTimeRemaining(task.deadline)
  const isAssignedToMe = task.taskView === 'AssignedToMe'
  const isAssignedByMe = task.taskView === 'AssignedByMe'
  const proof = task.proofSubmission
  const proofStatus = proof?.status || 'not_submitted'
  const canComplete = !readonly && task.permissions?.canComplete && !isAssignedToMe && !isAssignedByMe
  const canSubmitProof = !readonly && task.permissions?.canSubmitProof && !done
  const canReviewProof = !readonly && task.permissions?.canReviewProof && proofStatus === 'pending_review' && !done
  const canEdit = !readonly && task.permissions?.canEdit
  const canDelete = !readonly && task.permissions?.canDelete
  const assigneeName = typeof task.userId === 'object' ? task.userId?.name : ''
  const creatorName = typeof task.createdBy === 'object' ? task.createdBy?.name : ''
  const reviewerName = typeof proof?.reviewedBy === 'object' ? proof?.reviewedBy?.name : proof?.reviewedBy
  const typeLabel = task.taskView === 'AssignedToMe'
    ? 'Assigned to Me'
    : task.taskView === 'AssignedByMe'
    ? 'Assigned by Me'
    : 'Personal'

  const handleDelete = useCallback(() => {
    if (confirmDelete) { onDelete(task._id); setConfirmDelete(false) }
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000) }
  }, [confirmDelete, onDelete, task._id])

  const handleSubmitProof = useCallback((file) => onSubmitProof?.(task._id, file), [onSubmitProof, task._id])
  const handleApproveProof = useCallback(() => onApproveProof?.(task._id), [onApproveProof, task._id])
  const handleRejectProof = useCallback((reason) => onRejectProof?.(task._id, reason), [onRejectProof, task._id])

  const proofSummary = done
    ? 'Proof approved and task completed.'
    : proofStatus === 'pending_review'
    ? 'Proof submitted and waiting for review.'
    : proofStatus === 'rejected'
    ? 'Proof was rejected. A new file must be sent.'
    : isAssignedToMe
    ? 'Completion requires a proof file submission.'
    : isAssignedByMe
    ? 'Waiting for the assignee to submit proof.'
    : ''

  return (
    <>
      <div
        className="relative rounded-2xl border transition-all duration-300 p-4 group"
        style={{
          background: done ? 'rgb(var(--volt-300) / 0.04)' : locked ? 'rgb(var(--surface-muted) / 0.78)' : cfg.bg,
          borderColor: done ? 'rgb(var(--volt-300) / 0.2)' : locked ? 'rgb(var(--ink-500) / 0.3)' : cfg.border,
          opacity: locked && !done ? 0.7 : 1,
        }}
      >
        <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: done ? 'rgb(var(--volt-300))' : locked ? 'rgb(var(--ink-500))' : cfg.color, marginLeft: '-1px' }} />

        <div className="flex items-start gap-3 pl-3">
          {canComplete ? (
            <button
              onClick={() => !locked && !done && onComplete(task._id)}
              disabled={locked || done}
              className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
              style={{
                borderColor: done ? 'rgb(var(--volt-300))' : cfg.color,
                background: done ? 'rgb(var(--volt-300))' : 'transparent',
                cursor: locked || done ? 'default' : 'pointer',
              }}
            >
              {done && <Check size={12} color="rgb(var(--accent-contrast))" strokeWidth={3} />}
            </button>
          ) : (
            <div className="w-6 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`text-sm font-medium leading-snug ${done ? 'line-through text-ink-400' : 'text-ink-100'}`}>
                {task.title}
              </h3>
              <div className="flex-shrink-0 flex items-center gap-1.5 flex-wrap justify-end">
                {locked && !done && <Lock size={12} className="text-ink-500" />}
                {done && <span className="badge badge-completed">Done</span>}
                {!done && !locked && <span className={`badge ${PRIORITY_CONFIG[task.priority]?.badge || 'badge-medium'}`}>{task.priority}</span>}
                {proofStatus === 'pending_review' && !done && (
                  <span className="badge" style={{ background: 'rgba(116,192,252,0.14)', color: '#74C0FC', border: '1px solid rgba(116,192,252,0.32)' }}>
                    Under Review
                  </span>
                )}
                {proofStatus === 'rejected' && !done && (
                  <span className="badge" style={{ background: 'rgba(255,107,107,0.12)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.28)' }}>
                    Proof Rejected
                  </span>
                )}
                {isAssignedToMe && proofStatus === 'not_submitted' && !done && (
                  <span className="badge" style={{ background: 'rgba(255,179,71,0.12)', color: '#FFB347', border: '1px solid rgba(255,179,71,0.28)' }}>
                    Proof Required
                  </span>
                )}
                {locked && !done && <span className="badge badge-locked">Locked</span>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-ink-400">
              <TagBadge label={typeLabel} />
              {task.taskView === 'AssignedToMe' && creatorName && (
                <span className="inline-flex items-center gap-1">
                  <Send size={11} />
                  Assigned by {creatorName}
                </span>
              )}
              {task.taskView === 'AssignedByMe' && assigneeName && (
                <span className="inline-flex items-center gap-1">
                  <UserRound size={11} />
                  Assigned to {assigneeName}
                </span>
              )}
            </div>

            {(isAssignedToMe || isAssignedByMe || proof) && (
              <div
                className="mt-3 rounded-2xl p-3 space-y-3"
                style={{
                  background: 'rgb(var(--surface-muted) / 0.68)',
                  border: '1px solid rgb(var(--border-highlight) / 0.08)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-ink-500">Proof Workflow</p>
                    <p className="text-sm text-ink-200 mt-1">{proofSummary}</p>
                  </div>
                  {done ? (
                    <BadgeCheck size={18} className="text-volt-300 flex-shrink-0" />
                  ) : proofStatus === 'pending_review' ? (
                    <ShieldCheck size={18} className="text-sky-300 flex-shrink-0" />
                  ) : proofStatus === 'rejected' ? (
                    <ShieldX size={18} className="text-coral flex-shrink-0" />
                  ) : (
                    <FileUp size={18} className="text-ink-400 flex-shrink-0" />
                  )}
                </div>

                {(proof?.fileName || proof?.fileUrl) && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex items-start gap-2">
                      <FileText size={15} className="text-ink-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-ink-100 truncate">{proof.fileName || 'Uploaded proof file'}</p>
                        <p className="text-xs text-ink-500 mt-1">
                          {[proof.size ? formatFileSize(proof.size) : '', proof.submittedAt ? `Submitted ${formatDate(proof.submittedAt)}` : '']
                            .filter(Boolean)
                            .join(' | ')}
                        </p>
                      </div>
                    </div>
                    {proof.fileUrl && (
                      <a
                        href={proof.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-volt-300 hover:text-volt"
                      >
                        View Proof
                      </a>
                    )}
                  </div>
                )}

                {proofStatus === 'rejected' && proof?.rejectionReason && (
                  <div
                    className="rounded-xl p-3 text-sm text-coral"
                    style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}
                  >
                    Reason: {proof.rejectionReason}
                  </div>
                )}

                {proof?.reviewedAt && (
                  <p className="text-xs text-ink-500">
                    Reviewed {formatDate(proof.reviewedAt)}
                    {reviewerName ? ` by ${reviewerName}` : ''}
                  </p>
                )}

                {!readonly && (
                  <div className="flex flex-wrap gap-2">
                    {canSubmitProof && !locked && proofStatus !== 'pending_review' && (
                      <button
                        type="button"
                        onClick={() => setShowProofModal(true)}
                        disabled={loading}
                        className="btn-primary"
                      >
                        <FileUp size={14} />
                        {proofStatus === 'rejected' ? 'Resubmit Proof' : 'Submit Proof'}
                      </button>
                    )}
                    {canReviewProof && !locked && (
                      <>
                        <button
                          type="button"
                          onClick={handleApproveProof}
                          disabled={loading}
                          className="btn-primary"
                        >
                          <ShieldCheck size={14} />
                          Approve Proof
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRejectModal(true)}
                          disabled={loading}
                          className="btn-ghost text-coral hover:text-coral"
                        >
                          <ShieldX size={14} />
                          Reject Proof
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-ink-400">
                  <Clock size={10} />
                  {formatDate(task.creationTime, { timeOnly: true })} IST
                </span>
                {!done && (
                  <span className={`flex items-center gap-1 text-xs font-medium ${timeLeft.urgent ? 'text-coral' : timeLeft.expired ? 'text-ink-500' : 'text-ink-300'}`}>
                    {timeLeft.urgent && !timeLeft.expired && <AlertTriangle size={10} />}
                    {timeLeft.text}
                  </span>
                )}
              </div>

              {(canEdit || canDelete) && !locked && !done && (
                <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                  {canEdit && (
                    <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-white/5 text-ink-400 hover:text-ink-100 transition-colors">
                      <Pencil size={13} />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={handleDelete} className={`p-1.5 rounded-lg transition-colors ${confirmDelete ? 'bg-coral/20 text-coral' : 'hover:bg-white/5 text-ink-400 hover:text-coral'}`}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <TaskProofModal
        isOpen={showProofModal}
        mode="submit"
        taskTitle={task.title}
        loading={loading}
        onClose={() => setShowProofModal(false)}
        onSubmit={handleSubmitProof}
      />
      <TaskProofModal
        isOpen={showRejectModal}
        mode="reject"
        taskTitle={task.title}
        loading={loading}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectProof}
      />
    </>
  )
})

export default TaskCard
