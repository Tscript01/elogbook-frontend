import type {
  DailyLog,
  FinalClearance,
  LogBookApproval,
  Placement,
  StudentProfile,
  User,
  WeeklySubmission
} from '~/types/models'

export const mockStudent: User = {
  id: '6f6d4f2a-1c1a-4c2e-9f4f-9c0a2f1b7c11',
  email: 'a.okafor@student.unilag.edu.ng',
  name: 'Adaeze Okafor',
  role: 'STUDENT',
  created_at: '2026-04-12T09:24:00.000Z'
}

export const mockStudentProfile: StudentProfile = {
  user_id: mockStudent.id,
  matric_number: '190401052',
  institution: 'University of Lagos',
  faculty: 'Engineering',
  department: 'Computer Engineering',
  level: '400',
  phone: '+234 803 118 9042',
  avatar_url: null
}

export const mockIndustrySupervisor: User = {
  id: 'b3a1e0d4-6d55-4f0e-8f5a-2a2b7c9d1e22',
  email: 'tunde.bakare@zenithcore.ng',
  name: 'Engr. Tunde Bakare',
  role: 'IND_SUPERVISOR',
  created_at: '2026-03-02T10:00:00.000Z'
}

export const mockCoordinator: User = {
  id: 'c9d2f7b8-3e21-4a77-bb31-77f0c1a4e533',
  email: 'r.adeyemi@unilag.edu.ng',
  name: 'Dr. Ruth Adeyemi',
  role: 'INST_COORDINATOR',
  created_at: '2026-01-18T08:30:00.000Z'
}

export const mockPlacement: Placement = {
  id: 'd41f6a8e-52d9-4a9d-9d5c-1f4b6a7c8e44',
  student_id: mockStudent.id,
  company_name: 'ZenithCore Systems Ltd.',
  ind_supervisor_id: mockIndustrySupervisor.id,
  inst_coordinator_id: mockCoordinator.id,
  company_address: '14 Ligali Ayorinde Street, Victoria Island, Lagos',
  company_contact: '+234 701 442 8890',
  company_email: 'internships@zenithcore.ng',
  start_date: '2026-05-04',
  end_date: '2026-10-16'
}

export const TOTAL_WEEKS = 24

const addDays = (iso: string, days: number): string => {
  const date = new Date(`${iso}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export const weekStartDate = (weekNo: number): string =>
  addDays(mockPlacement.start_date, (weekNo - 1) * 7)

export const weekEndDate = (weekNo: number): string => addDays(weekStartDate(weekNo), 4)

const submissionId = (weekNo: number): string =>
  `a1b2c3d4-0000-4000-8000-${String(weekNo).padStart(12, '0')}`

const logId = (weekNo: number, dayIndex: number): string =>
  `e5f6a7b8-0000-4000-8000-${String(weekNo).padStart(6, '0')}${String(dayIndex).padStart(6, '0')}`

const submissionStatuses: Record<number, WeeklySubmission['status']> = {
  1: 'APPROVED',
  2: 'APPROVED',
  3: 'APPROVED',
  4: 'REJECTED',
  5: 'SUBMITTED',
  6: 'PENDING'
}

export const mockWeeklySubmissions: WeeklySubmission[] = Array.from(
  { length: TOTAL_WEEKS },
  (_, index) => {
    const weekNo = index + 1
    return {
      id: submissionId(weekNo),
      placement_id: mockPlacement.id,
      week_no: weekNo,
      status: submissionStatuses[weekNo] ?? 'PENDING'
    }
  }
)

const weeklyActivities: Record<number, string[]> = {
  1: [
    'Attended the company induction session covering workplace safety, the ZenithCore code of conduct and the internal escalation matrix. Collected my access badge and workstation credentials.',
    'Shadowed the platform engineering team during their daily stand-up and documented how the sprint board maps to production releases.',
    'Set up the local development environment: installed Node.js, PostgreSQL and Docker, then cloned the billing service repository and ran the seed scripts.',
    'Studied the entity relationship diagram of the customer billing database and traced how invoice records flow between the ledger and reconciliation tables.',
    'Prepared a short summary of my first week observations and reviewed it with my industry supervisor during the Friday debrief.'
  ],
  2: [
    'Worked through the internal Git branching guide and raised my first pull request adding validation to the invoice reference field.',
    'Paired with a senior engineer to trace a failing integration test in the reconciliation module and identified a timezone conversion defect.',
    'Wrote unit tests for the currency formatting helper and increased branch coverage of the utility package.',
    'Attended the fortnightly architecture review where the migration from scheduled jobs to an event driven queue was presented.',
    'Documented the queue migration notes in Confluence and shared the draft with the team lead for review.'
  ],
  3: [
    'Investigated latency alerts on the settlement endpoint using the observability dashboard and captured the slow query traces.',
    'Added a composite index to the settlement lookup table in a staging branch and measured the query improvement.',
    'Presented the latency findings during stand-up and agreed a rollout plan with the database administrator.',
    'Assisted with the quarterly disaster recovery drill by validating the restored database snapshot against production checksums.',
    'Closed out the week by updating the runbook with the new index maintenance steps.'
  ],
  4: [
    'Started building an internal admin screen for reconciliation exceptions using the company component library.',
    'Implemented the filter and pagination behaviour for the exceptions table and connected it to the staging API.',
    'Received design feedback on spacing and empty states, then reworked the table layout to match the design system.',
    'Attended a compliance briefing on how customer financial data must be masked in non production environments.',
    'Applied data masking to the sample fixtures and requested a review from the compliance officer.'
  ],
  5: [
    'Refactored the exceptions screen into smaller composable units so the filters can be reused on the audit page.',
    'Wrote end to end tests covering the exception approval and rejection flows.',
    'Fixed accessibility issues flagged by the automated audit, including missing form labels and low contrast badges.',
    'Deployed the admin screen to the staging environment and walked the operations team through the workflow.',
    'Collected feedback from the operations team and logged three follow up tickets in the backlog.'
  ]
}

export const mockDailyLogs: DailyLog[] = Object.entries(weeklyActivities).flatMap(
  ([week, descriptions]) => {
    const weekNo = Number(week)
    return descriptions.map((description, dayIndex) => ({
      id: logId(weekNo, dayIndex),
      placement_id: mockPlacement.id,
      weekly_submission_id: submissionId(weekNo),
      week_no: weekNo,
      log_date: addDays(weekStartDate(weekNo), dayIndex),
      description,
      image_url:
        weekNo === 3 && dayIndex === 1
          ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60'
          : weekNo === 4 && dayIndex === 0
            ? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=60'
            : null,
      created_timestamp: `${addDays(weekStartDate(weekNo), dayIndex)}T17:05:00.000Z`
    }))
  }
)

export const mockApprovals: LogBookApproval[] = [
  {
    id: 'f1a2b3c4-1111-4000-8000-000000000001',
    weekly_submission_id: submissionId(1),
    supervisor_id: mockIndustrySupervisor.id,
    approval_timestamp: '2026-05-11T09:12:00.000Z',
    cryptographic_signature_hash: '9f2c1d7ab4e35f80c6a1d0e7b3945172c8ad61fe',
    feedback:
      'Good start. Your induction notes are detailed. Going forward, include the names of the tools you used for each task.',
    grade: 82
  },
  {
    id: 'f1a2b3c4-1111-4000-8000-000000000002',
    weekly_submission_id: submissionId(2),
    supervisor_id: mockIndustrySupervisor.id,
    approval_timestamp: '2026-05-18T10:40:00.000Z',
    cryptographic_signature_hash: '3b81e0d5aa17c94f2e6b8d03f5719ac4e2d6708b',
    feedback: 'Strong technical detail on the timezone defect. Keep documenting your test cases.',
    grade: 88
  },
  {
    id: 'f1a2b3c4-1111-4000-8000-000000000003',
    weekly_submission_id: submissionId(3),
    supervisor_id: mockIndustrySupervisor.id,
    approval_timestamp: '2026-05-25T08:55:00.000Z',
    cryptographic_signature_hash: 'c7d40a92be1358f7d2094ba6e83f10cd7b5e2249',
    feedback: 'Excellent troubleshooting narrative. The attached query plan diagram was very useful.',
    grade: 91
  },
  {
    id: 'f1a2b3c4-1111-4000-8000-000000000004',
    weekly_submission_id: submissionId(4),
    supervisor_id: mockIndustrySupervisor.id,
    approval_timestamp: '2026-06-01T14:20:00.000Z',
    cryptographic_signature_hash: '',
    feedback:
      'Thursday and Friday entries are too brief and no diagram was attached for the admin screen. Please expand and resubmit.',
    grade: null
  }
]

export const mockClearance: FinalClearance = {
  id: 'aa11bb22-cc33-4d44-8e55-ff6677889900',
  placement_id: mockPlacement.id,
  coordinator_status: 'PENDING',
  coordinator_cleared_at: null,
  itf_official_id: null,
  itf_status: 'PENDING',
  itf_cleared_at: null,
  final_pdf_hash: null,
  itf_stamp_hash: null,
  clearance_timestamp: null
}
