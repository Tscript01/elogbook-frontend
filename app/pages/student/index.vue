<template>
  <div class="space-y-6">
    <section
      class="overflow-hidden rounded-xl bg-primary-700 px-5 py-6 text-white sm:px-7 dark:bg-primary-900"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-primary-200">Industrial training</p>
          <h2 class="mt-1 text-xl font-semibold sm:text-2xl">
            Welcome back, {{ firstName }}
          </h2>
          <p class="mt-2 max-w-xl text-sm text-primary-100">
            You are on week {{ logbook.activeWeekNo }} of {{ logbook.totalWeeks }} at
            {{ logbook.placement.company_name }} - keep your entries current so your supervisor can
            sign off on time.
          </p>
        </div>
        <UiBaseButton to="/student/logbook" variant="secondary" size="lg">
          <NotebookPen class="h-4 w-4" aria-hidden="true" />
          Continue logbook
        </UiBaseButton>
      </div>

      <div class="mt-6 max-w-md">
        <UiProgressBar :value="logbook.completionRate" label="Overall logbook completion" />
        <p class="mt-2 text-xs text-primary-100">
          {{ logbook.completionRate }}% of the scheme recorded
        </p>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UiStatCard
        label="Weeks approved"
        :value="`${logbook.approvedWeeks}/${logbook.totalWeeks}`"
        hint="Signed off by your supervisor"
        :icon="CheckCircle2"
        tone="secondary"
      />
      <UiStatCard
        label="Pending entries"
        :value="logbook.pendingEntries"
        hint="Days still to be filled"
        :icon="Clock"
        tone="amber"
      />
      <UiStatCard
        label="Average grade"
        :value="logbook.averageGrade === null ? 'N/A' : `${logbook.averageGrade}/100`"
        hint="Across graded weeks"
        :icon="TrendingUp"
      />
      <UiStatCard
        label="Days remaining"
        :value="daysRemaining"
        hint="Until the end of placement"
        :icon="CalendarDays"
        tone="slate"
      />
    </section>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <UiBaseCard
        class="xl:col-span-2"
        title="Recent supervisor feedback"
        description="The latest reviews on your submissions"
      >
        <div v-if="logbook.recentFeedback.length" class="space-y-3">
          <StudentSupervisorFeedbackCard
            v-for="approval in logbook.recentFeedback"
            :key="approval.id"
            :approval="approval"
            :week-no="weekNoForApproval(approval.weekly_submission_id)"
            :supervisor="logbook.placement.ind_supervisor.name"
          />
        </div>
        <UiEmptyState
          v-else
          :icon="MessageSquareQuote"
          title="No feedback yet"
          description="Submit a week to receive comments from your industry supervisor."
        />
      </UiBaseCard>

      <div class="space-y-6">
        <UiBaseCard title="Placement details" description="Approved by your coordinator">
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Company
              </dt>
              <dd class="font-medium text-slate-800 dark:text-slate-100">
                {{ logbook.placement.company_name }}
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Industry supervisor
              </dt>
              <dd class="text-slate-600 dark:text-slate-300">
                {{ logbook.placement.ind_supervisor.name }}
                <span class="block text-xs text-slate-500 dark:text-slate-400">
                  {{ logbook.placement.ind_supervisor.email }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Institution coordinator
              </dt>
              <dd class="text-slate-600 dark:text-slate-300">
                {{ logbook.placement.inst_coordinator?.name ?? 'Not assigned' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Duration
              </dt>
              <dd class="text-slate-600 dark:text-slate-300">
                {{ formatRange(logbook.placement.start_date, logbook.placement.end_date) }}
              </dd>
            </div>
          </dl>
          <UiBaseButton class="mt-4" to="/student/placement" variant="outline" size="sm" block>
            Manage placement
          </UiBaseButton>
        </UiBaseCard>

        <UiBaseCard title="Upcoming deadline" description="Current week submission">
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Week {{ logbook.activeWeekNo }} closes on
            <span class="font-medium text-slate-900 dark:text-white">
              {{ formatShortDate(logbook.activeWeekRange.end) }}
            </span>
          </p>
          <UiProgressBar
            class="mt-3"
            tone="secondary"
            :value="(logbook.activeWeekLogs.length / 5) * 100"
            label="Entries completed this week"
          />
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {{ logbook.activeWeekLogs.length }} of 5 daily entries recorded
          </p>
        </UiBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageSquareQuote,
  NotebookPen,
  TrendingUp
} from '@lucide/vue'
import { computed } from 'vue'
import { useLogbookStore } from '~/stores/logbook'
import { useSessionStore } from '~/stores/session'
import { daysBetween, formatRange, formatShortDate } from '~/utils/date'

definePageMeta({
  layout: 'student',
  title: 'Dashboard',
  breadcrumbs: [{ label: 'Dashboard' }]
})

const logbook = useLogbookStore()
const session = useSessionStore()

const firstName = computed(() => session.user.name.split(' ')[0])

const daysRemaining = computed(() =>
  Math.max(
    daysBetween(logbook.activeWeekRange.start, logbook.placement.end_date),
    0
  )
)

const weekNoForApproval = (submissionId: string): number =>
  logbook.submissions.find((submission) => submission.id === submissionId)?.week_no ?? 0
</script>
