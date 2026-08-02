<template>
  <UiBaseCard
    title="Weekly submissions"
    description="Every week of your industrial training"
    :padded="false"
  >
    <template #actions>
      <div class="flex items-center gap-2">
        <label for="status-filter" class="sr-only">Filter by status</label>
        <select id="status-filter" v-model="statusFilter" class="field-control w-48">
          <option value="ALL">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ submissionLabel[status] }}
          </option>
        </select>
      </div>
    </template>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left text-sm">
        <caption class="sr-only">
          Submission status for each training week
        </caption>
        <thead>
          <tr
            class="bg-parchment-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <th scope="col" class="px-4 py-2.5 font-semibold">Week</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Period</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Entries</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
            <th scope="col" class="px-4 py-2.5 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="week in filteredWeeks"
            :key="week.id"
            class="border-t border-slate-200 dark:border-slate-800"
          >
            <th scope="row" class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
              Week {{ week.week_no }}
            </th>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
              {{ formatRange(weekStartDate(week.week_no), weekEndDate(week.week_no)) }}
            </td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
              {{ week.daily_logs.length }}/5
            </td>
            <td class="px-4 py-3">
              <UiBaseBadge :tone="submissionTone[week.status]" dot>
                {{ submissionLabel[week.status] }}
              </UiBaseBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950"
                @click="openWeek(week.week_no)"
              >
                Open
                <span class="sr-only">week {{ week.week_no }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { weekEndDate, weekStartDate } from '~/data/mock-student'
import { useLogbookStore } from '~/stores/logbook'
import type { SubmissionStatus } from '~/types/models'
import { formatRange } from '~/utils/date'
import { submissionLabel, submissionTone } from '~/utils/status'

definePageMeta({
  layout: 'student',
  title: 'Submissions',
  breadcrumbs: [{ label: 'Submissions' }]
})

const logbook = useLogbookStore()

const statuses: SubmissionStatus[] = ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED']
const statusFilter = ref<SubmissionStatus | 'ALL'>('ALL')

const filteredWeeks = computed(() =>
  logbook.weeks.filter((week) => statusFilter.value === 'ALL' || week.status === statusFilter.value)
)

const openWeek = async (weekNo: number) => {
  logbook.setActiveWeek(weekNo)
  await navigateTo('/student/logbook')
}
</script>
