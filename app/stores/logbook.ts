import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from '~/composables/useToast'
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
import { createApiService } from '~/services/api'
import type {
  DailyLog,
  LogBookApproval,
  Placement,
  PlacementWithRelations,
  WeeklySubmission,
  WeekWithLogs
} from '~/types/models'
import { addDays } from '~/utils/date'

const WORKING_DAYS = 5

export const useLogbookStore = defineStore('logbook', () => {
  const apiService = createApiService()
  const toast = useToast()

  // State
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

  // API Loading & Status Flags
  const isLoading = ref(false)
  const isSavingLog = ref(false)
  const isSubmittingWeek = ref(false)
  const isSavingPlacement = ref(false)
  const isUploadingMedia = ref(false)
  const hasLoadedFromApi = ref(false)
  const apiError = ref<string | null>(null)

  // Computed & Helpers
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
    () =>
      activeSubmission.value?.status === 'SUBMITTED' ||
      activeSubmission.value?.status === 'APPROVED'
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

  // API Actions
  const loadInitialData = async () => {
    if (isLoading.value) return
    isLoading.value = true
    apiError.value = null

    try {
      // Attempt to load from API in parallel
      const [resPlacement, resSubmissions, resLogs, resApprovals, resClearance] =
        await Promise.allSettled([
          apiService.placement.getPlacement(),
          apiService.submissions.getSubmissions(),
          apiService.logs.getLogs(),
          apiService.approvals.getApprovals(),
          apiService.clearance.getClearance()
        ])

      let connectedCount = 0

      if (resPlacement.status === 'fulfilled' && resPlacement.value) {
        placement.value = {
          ...placement.value,
          ...resPlacement.value
        }
        connectedCount += 1
      }

      if (
        resSubmissions.status === 'fulfilled' &&
        Array.isArray(resSubmissions.value) &&
        resSubmissions.value.length > 0
      ) {
        submissions.value = resSubmissions.value
        connectedCount += 1
      }

      if (resLogs.status === 'fulfilled' && Array.isArray(resLogs.value) && resLogs.value.length > 0) {
        dailyLogs.value = resLogs.value
        connectedCount += 1
      }

      if (
        resApprovals.status === 'fulfilled' &&
        Array.isArray(resApprovals.value) &&
        resApprovals.value.length > 0
      ) {
        approvals.value = resApprovals.value
        connectedCount += 1
      }

      if (resClearance.status === 'fulfilled' && resClearance.value) {
        clearance.value = { ...clearance.value, ...resClearance.value }
        connectedCount += 1
      }

      if (connectedCount > 0) {
        hasLoadedFromApi.value = true
        toast.success('Synced with backend API', `Retrieved latest data from server.`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'API sync error'
      console.warn('API sync warning:', msg)
      apiError.value = msg
    } finally {
      isLoading.value = false
    }
  }

  const saveLog = async (payload: {
    date: string
    description: string
    image_url: string | null
  }) => {
    const submission = activeSubmission.value
    if (!submission) return

    isSavingLog.value = true
    const existing = logForDate(payload.date)

    try {
      let savedLog: DailyLog | null = null

      try {
        if (existing && !existing.id.startsWith('draft-')) {
          savedLog = await apiService.logs.updateLog(existing.id, {
            description: payload.description,
            image_url: payload.image_url
          })
        } else {
          savedLog = await apiService.logs.createLog({
            week_no: submission.week_no,
            log_date: payload.date,
            description: payload.description,
            image_url: payload.image_url
          })
        }
      } catch (apiErr: unknown) {
        const msg = apiErr instanceof Error ? apiErr.message : 'API error'
        console.warn('Backend log save error (falling back to local cache):', msg)
      }

      if (savedLog) {
        if (existing) {
          const idx = dailyLogs.value.findIndex((l) => l.id === existing.id)
          if (idx !== -1) dailyLogs.value[idx] = savedLog
        } else {
          dailyLogs.value.push(savedLog)
        }
        toast.success('Daily entry saved', 'Saved successfully to your electronic logbook.')
      } else {
        // Local state update when API is not responding
        if (existing) {
          existing.description = payload.description
          existing.image_url = payload.image_url
        } else {
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
        toast.info('Entry saved locally', 'Log saved in session (waiting for API connection).')
      }
    } finally {
      isSavingLog.value = false
    }
  }

  const deleteLog = async (date: string) => {
    const target = logForDate(date)
    if (!target) return

    isSavingLog.value = true
    try {
      if (!target.id.startsWith('draft-')) {
        try {
          await apiService.logs.deleteLog(target.id)
        } catch (apiErr: unknown) {
          const msg = apiErr instanceof Error ? apiErr.message : 'API error'
          console.warn('Backend log delete error:', msg)
        }
      }

      dailyLogs.value = dailyLogs.value.filter((log) => log.log_date !== date)
      toast.success('Entry removed', 'The daily log has been cleared.')
    } finally {
      isSavingLog.value = false
    }
  }

  const submitActiveWeek = async () => {
    const submission = activeSubmission.value
    if (!submission) return

    isSubmittingWeek.value = true
    try {
      try {
        await apiService.submissions.submitWeek({
          week_no: submission.week_no,
          submission_id: submission.id
        })
        toast.success(
          'Week submitted',
          `Week ${submission.week_no} has been submitted to your supervisor for review.`
        )
      } catch (apiErr: unknown) {
        const msg = apiErr instanceof Error ? apiErr.message : 'API error'
        console.warn('Backend submit error (applying local status):', msg)
        toast.info(
          'Submitted (offline mode)',
          `Week ${submission.week_no} marked as submitted locally.`
        )
      }

      submission.status = 'SUBMITTED'
    } finally {
      isSubmittingWeek.value = false
    }
  }

  const savePlacement = async (data: Partial<Placement>) => {
    isSavingPlacement.value = true
    try {
      try {
        const saved = await apiService.placement.savePlacement(data)
        if (saved) {
          placement.value = {
            ...placement.value,
            ...saved
          }
        }
        toast.success('Placement updated', 'Placement information saved on the server.')
      } catch (apiErr: unknown) {
        const msg = apiErr instanceof Error ? apiErr.message : 'API error'
        console.warn('Backend placement update error:', msg)
        placement.value = {
          ...placement.value,
          ...data
        }
        toast.info('Placement updated locally', 'Changes saved locally in session.')
      }
    } finally {
      isSavingPlacement.value = false
    }
  }

  const uploadMedia = async (file: File): Promise<string> => {
    isUploadingMedia.value = true
    try {
      try {
        const res = await apiService.logs.uploadMedia(file)
        if (res.url) return res.url
      } catch (apiErr: unknown) {
        const msg = apiErr instanceof Error ? apiErr.message : 'API error'
        console.warn('Backend upload error, fallback to object URL:', msg)
      }
      return URL.createObjectURL(file)
    } finally {
      isUploadingMedia.value = false
    }
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
    isLoading,
    isSavingLog,
    isSubmittingWeek,
    isSavingPlacement,
    isUploadingMedia,
    hasLoadedFromApi,
    apiError,
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
    loadInitialData,
    saveLog,
    deleteLog,
    submitActiveWeek,
    savePlacement,
    uploadMedia
  }
})
