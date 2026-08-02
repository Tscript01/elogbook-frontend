<template>
  <div class="space-y-6">
    <StudentWeekSelector
      :weeks="logbook.weeks"
      :active-week="logbook.activeWeekNo"
      :total-weeks="logbook.totalWeeks"
      :range-label="rangeLabel"
      @change="logbook.setActiveWeek"
    />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="space-y-6 xl:col-span-2">
        <StudentDayNavigator
          :dates="logbook.activeWeekDates"
          :active-date="logbook.activeDate"
          :filled-dates="filledDates"
          @select="logbook.setActiveDate"
        />

        <StudentLogEntryEditor
          :date="logbook.activeDate"
          :week-no="logbook.activeWeekNo"
          :log="logbook.activeLog ?? null"
          :locked="logbook.isWeekLocked"
          @save="logbook.saveLog"
          @delete="logbook.deleteLog"
        />

        <StudentWeekLogSheet
          :dates="logbook.activeWeekDates"
          :logs="logbook.activeWeekLogs"
          :active-date="logbook.activeDate"
          :status="activeStatus"
          :week-no="logbook.activeWeekNo"
          :range-label="rangeLabel"
          @select="logbook.setActiveDate"
        />
      </div>

      <div class="space-y-6">
        <StudentWeekSubmissionPanel
          :completed="logbook.activeWeekLogs.length"
          :status="activeStatus"
          :supervisor="logbook.placement.ind_supervisor.name"
          :locked="logbook.isWeekLocked"
          @submit="logbook.submitActiveWeek"
        />

        <UiBaseCard title="Supervisor feedback" description="Comments on this week">
          <StudentSupervisorFeedbackCard
            v-if="activeApproval"
            :approval="activeApproval"
            :week-no="logbook.activeWeekNo"
            :supervisor="logbook.placement.ind_supervisor.name"
          />
          <UiEmptyState
            v-else
            :icon="MessageSquareQuote"
            title="No feedback yet"
            description="Feedback appears here once your industry supervisor reviews this week."
          />
        </UiBaseCard>

        <UiBaseCard title="Placement" description="Where you are training">
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
                Address
              </dt>
              <dd class="text-slate-600 dark:text-slate-300">
                {{ logbook.placement.company_address }}
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Training period
              </dt>
              <dd class="text-slate-600 dark:text-slate-300">
                {{ formatRange(logbook.placement.start_date, logbook.placement.end_date) }}
              </dd>
            </div>
          </dl>
        </UiBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageSquareQuote } from '@lucide/vue'
import { computed } from 'vue'
import { useLogbookStore } from '~/stores/logbook'
import { formatRange } from '~/utils/date'

definePageMeta({
  layout: 'student',
  title: 'Weekly logbook',
  breadcrumbs: [{ label: 'Weekly logbook' }]
})

const logbook = useLogbookStore()

const rangeLabel = computed(() =>
  formatRange(logbook.activeWeekRange.start, logbook.activeWeekRange.end)
)

const filledDates = computed(() => logbook.activeWeekLogs.map((log) => log.log_date))

const activeStatus = computed(() => logbook.activeSubmission?.status ?? 'PENDING')

const activeApproval = computed(() => logbook.approvalForWeek(logbook.activeWeekNo))
</script>
