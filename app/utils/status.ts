import type { ClearanceStatus, SubmissionStatus } from '~/types/models'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export const submissionTone: Record<SubmissionStatus, BadgeTone> = {
  PENDING: 'neutral',
  SUBMITTED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger'
}

export const submissionLabel: Record<SubmissionStatus, string> = {
  PENDING: 'Draft',
  SUBMITTED: 'Awaiting review',
  APPROVED: 'Approved',
  REJECTED: 'Changes requested'
}

export const clearanceTone: Record<ClearanceStatus, BadgeTone> = {
  PENDING: 'warning',
  CLEARED: 'success',
  FLAGGED: 'danger'
}

export const clearanceLabel: Record<ClearanceStatus, string> = {
  PENDING: 'Pending',
  CLEARED: 'Cleared',
  FLAGGED: 'Flagged'
}
