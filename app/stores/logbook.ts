import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  DailyLog,
  LogBookApproval,
  PlacementWithRelations,
  WeeklySubmission,
  WeekWithLogs
} from '~/types/models'
import {
  TOTAL_WEEKS,
  mockApprovals,
  mockClearance,
  mockCoordinator,
  mockDailyLogs,
  mockIndustrySupervisor,
  mockPlacement,
  mockStudent,
  mockWeeklySubmissions,
  weekEndDate,
  weekStartDate
} from '~/data/mock-student'
import { addDays } from '~/utils/date'

const WORKING_DAYS = 5

export const useLogbookStore = defineStore('logbook', () => {
  const placement = ref<PlacementWithRelations>({
    ...mockPlacement,
    student: mockStudent,
    ind_supervisor: mockIndustrySupervisor,
    inst_coordinator: mockCoordinator
  })

  const submissions = ref<WeeklySubmission[]>([...mockWeeklySubmissions])
  const dailyLogs = ref<DailyLog[]>([...mockDailyLogs])
  const approvals = ref<LogBookApproval[]>([...mockApprovals])
  const clearance = ref({ ...mockClearance })

  const totalWeeks = TOTAL_WEEKS
  const activeWeekNo = ref(5)
  const activeDate = ref(weekStartDate(5))

  const datesForWeek = (weekNo: number): string[] =>
    Array.from({ length: WORKING_DAYS }, (_, index) => addDays(weekStartDate(weekNo), index))

  const logsForWeek = (weekNo: number): DailyLog[] =>
    dailyLogs.value
      .filter((log) => log.week_no === weekNo)
      .sort((a, b) => a.log_date.localeCompare(b.log_date))

  const submissionForWeek = (weekNo: number): WeeklySubmission | undefined =>
    submissions.value.find((submission) => submission.week_no === weekNo)

  const approvalForWeek = (weekNo: number): LogBookApproval | null => {
    const submission = submissionForWeek(weekNo)
    if (!submission) return null
    return approvals.value.find((item) => item.weekly_submission_id === submission.id) ?? null
  }

  const weeks = computed<WeekWithLogs[]>(() =>
    submissions.value.map((submission) => ({
      ...submission,
      daily_logs: logsForWeek(submission.week_no),
      approval: approvalForWeek(submission.week_no)
    }))
  )

  const activeSubmission = computed<WeeklySubmission | undefined>(() =>
    submissionForWeek(activeWeekNo.value)
  )

  const activeWeekLogs = computed<DailyLog[]>(() => logsForWeek(activeWeekNo.value))

  const activeWeekDates = computed<string[]>(() => datesForWeek(activeWeekNo.value))

  const activeWeekRange = computed(() => ({
    start: weekStartDate(activeWeekNo.value),
    end: weekEndDate(activeWeekNo.value)
  }))

  const logForDate = (date: string): DailyLog | undefined =>
    dailyLogs.value.find((log) => log.log_date === date)

  const activeLog = computed<DailyLog | undefined>(() => logForDate(activeDate.value))

  const isWeekLocked = computed(
    () => activeSubmission.value?.status === 'SUBMITTED' || activeSubmission.value?.status === 'APPROVED'
  )

  const completedDaysForWeek = (weekNo: number): number => logsForWeek(weekNo).length

  const approvedWeeks = computed(
    () => submissions.value.filter((submission) => submission.status === 'APPROVED').length
  )

  const pendingEntries = computed(() => {
    const elapsedWeeks = Math.min(activeWeekNo.value, totalWeeks)
    let missing = 0
    for (let weekNo = 1; weekNo <= elapsedWeeks; weekNo += 1) {
      missing += WORKING_DAYS - completedDaysForWeek(weekNo)
    }
    return missing
  })

  const completionRate = computed(() =>
    Math.round((dailyLogs.value.length / (totalWeeks * WORKING_DAYS)) * 100)
  )

  const recentFeedback = computed<LogBookApproval[]>(() =>
    [...approvals.value]
      .filter((approval) => Boolean(approval.feedback))
      .sort((a, b) => b.approval_timestamp.localeCompare(a.approval_timestamp))
      .slice(0, 3)
  )

  const averageGrade = computed(() => {
    const graded = approvals.value.filter(
      (approval): approval is LogBookApproval & { grade: number } => approval.grade !== null
    )
    if (graded.length === 0) return null
    return Math.round(graded.reduce((total, approval) => total + approval.grade, 0) / graded.length)
  })

  const setActiveWeek = (weekNo: number) => {
    const clamped = Math.min(Math.max(weekNo, 1), totalWeeks)
    activeWeekNo.value = clamped
    activeDate.value = weekStartDate(clamped)
  }

  const setActiveDate = (date: string) => {
    activeDate.value = date
  }

  const saveLog = (payload: { date: string; description: string; image_url: string | null }) => {
    const submission = activeSubmission.value
    if (!submission) return
    const existing = logForDate(payload.date)
    if (existing) {
      existing.description = payload.description
      existing.image_url = payload.image_url
      return
    }
    dailyLogs.value.push({
      id: `draft-${payload.date}`,
      placement_id: placement.value.id,
      weekly_submission_id: submission.id,
      week_no: submission.week_no,
      log_date: payload.date,
      description: payload.description,
      image_url: payload.image_url,
      created_timestamp: new Date().toISOString()
    })
  }

  const deleteLog = (date: string) => {
    dailyLogs.value = dailyLogs.value.filter((log) => log.log_date !== date)
  }

  const submitActiveWeek = () => {
    const submission = activeSubmission.value
    if (!submission) return
    submission.status = 'SUBMITTED'
  }

  return {
    placement,
    submissions,
    dailyLogs,
    approvals,
    clearance,
    totalWeeks,
    activeWeekNo,
    activeDate,
    weeks,
    activeSubmission,
    activeWeekLogs,
    activeWeekDates,
    activeWeekRange,
    activeLog,
    isWeekLocked,
    approvedWeeks,
    pendingEntries,
    completionRate,
    recentFeedback,
    averageGrade,
    datesForWeek,
    logsForWeek,
    submissionForWeek,
    approvalForWeek,
    completedDaysForWeek,
    logForDate,
    setActiveWeek,
    setActiveDate,
    saveLog,
    deleteLog,
    submitActiveWeek
  }
})
