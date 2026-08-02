export type Role = 'STUDENT' | 'IND_SUPERVISOR' | 'INST_COORDINATOR' | 'ITF_OFFICIAL' | 'ADMIN'

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export type ClearanceStatus = 'PENDING' | 'CLEARED' | 'FLAGGED'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  created_at: string
}

export interface StudentProfile {
  user_id: string
  matric_number: string
  institution: string
  faculty: string
  department: string
  level: string
  phone: string
  avatar_url: string | null
}

export interface Placement {
  id: string
  student_id: string
  company_name: string
  ind_supervisor_id: string
  inst_coordinator_id: string | null
  company_address: string | null
  company_contact: string | null
  company_email: string | null
  start_date: string
  end_date: string
}

export interface WeeklySubmission {
  id: string
  placement_id: string
  week_no: number
  status: SubmissionStatus
}

export interface DailyLog {
  id: string
  placement_id: string
  weekly_submission_id: string
  week_no: number
  log_date: string
  description: string
  image_url: string | null
  created_timestamp: string
}

export interface LogBookApproval {
  id: string
  weekly_submission_id: string
  supervisor_id: string
  approval_timestamp: string
  cryptographic_signature_hash: string
  feedback: string | null
  grade: number | null
}

export interface FinalClearance {
  id: string
  placement_id: string
  coordinator_status: ClearanceStatus
  coordinator_cleared_at: string | null
  itf_official_id: string | null
  itf_status: ClearanceStatus
  itf_cleared_at: string | null
  final_pdf_hash: string | null
  itf_stamp_hash: string | null
  clearance_timestamp: string | null
}

export interface PlacementWithRelations extends Placement {
  student: User
  ind_supervisor: User
  inst_coordinator: User | null
}

export interface WeekWithLogs extends WeeklySubmission {
  daily_logs: DailyLog[]
  approval: LogBookApproval | null
}
