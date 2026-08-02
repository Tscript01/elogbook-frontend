<template>
  <div class="paper-sheet p-4 sm:p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-900 dark:text-white">
          Week {{ activeWeek }} of {{ totalWeeks }}
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ rangeLabel }}</p>
      </div>

      <div class="flex items-center gap-2">
        <label for="week-select" class="sr-only">Jump to week</label>
        <select
          id="week-select"
          class="field-control w-36"
          :value="activeWeek"
          @change="onSelect(($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="week in weeks"
            :key="week.week_no"
            :value="week.week_no"
            :selected="week.week_no === activeWeek"
          >
            Week {{ week.week_no }}
          </option>
        </select>
        <button
          type="button"
          class="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          :disabled="activeWeek <= 1"
          aria-label="Previous week"
          @click="emit('change', activeWeek - 1)"
        >
          <ChevronLeft class="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          :disabled="activeWeek >= totalWeeks"
          aria-label="Next week"
          @click="emit('change', activeWeek + 1)"
        >
          <ChevronRight class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <ul class="mt-4 flex snap-x gap-2 overflow-x-auto pb-1" aria-label="Training weeks">
      <li v-for="week in weeks" :key="week.week_no" class="snap-start">
        <button
          type="button"
          class="flex min-w-[86px] flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition"
          :class="
            week.week_no === activeWeek
              ? 'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
          "
          :aria-current="week.week_no === activeWeek ? 'true' : undefined"
          @click="emit('change', week.week_no)"
        >
          <span class="text-xs font-semibold text-slate-800 dark:text-slate-100">
            Week {{ week.week_no }}
          </span>
          <span
            class="h-1.5 w-full rounded-full"
            :class="statusBar[week.status]"
            aria-hidden="true"
          />
          <span class="text-[11px] text-slate-500 dark:text-slate-400">
            {{ week.daily_logs.length }}/5 entries
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { SubmissionStatus, WeekWithLogs } from '~/types/models'

defineProps<{
  weeks: WeekWithLogs[]
  activeWeek: number
  totalWeeks: number
  rangeLabel: string
}>()

const emit = defineEmits<{ change: [week: number] }>()

const onSelect = (value: string) => emit('change', Number(value))

const statusBar: Record<SubmissionStatus, string> = {
  PENDING: 'bg-slate-200 dark:bg-slate-700',
  SUBMITTED: 'bg-primary-500',
  APPROVED: 'bg-secondary-500',
  REJECTED: 'bg-red-500'
}
</script>
