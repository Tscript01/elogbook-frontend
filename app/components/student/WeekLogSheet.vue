<template>
  <UiBaseCard title="Week at a glance" :description="rangeLabel" :padded="false">
    <template #actions>
      <UiBaseBadge :tone="submissionTone[status]" dot>{{ submissionLabel[status] }}</UiBaseBadge>
    </template>

    <div class="hidden overflow-x-auto md:block">
      <table class="w-full border-collapse text-left text-sm">
        <caption class="sr-only">
          Daily entries recorded for week {{ weekNo }}
        </caption>
        <thead>
          <tr class="bg-parchment-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <th scope="col" class="w-40 px-4 py-2.5 font-semibold">Date</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Work done</th>
            <th scope="col" class="w-28 px-4 py-2.5 font-semibold">Media</th>
            <th scope="col" class="w-24 px-4 py-2.5 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="date in dates"
            :key="date"
            class="border-t border-slate-200 align-top transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            :class="date === activeDate ? 'bg-primary-50/60 dark:bg-primary-950/40' : ''"
          >
            <th scope="row" class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
              <span class="block font-serif">{{ formatDayLabel(date) }}</span>
              <span class="block text-xs font-normal text-slate-500 dark:text-slate-400">
                {{ formatShortDate(date) }}
              </span>
            </th>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
              <p v-if="logByDate(date)" class="line-clamp-3 font-serif leading-relaxed">
                {{ logByDate(date)?.description }}
              </p>
              <p v-else class="text-xs italic text-slate-400 dark:text-slate-500">
                No entry recorded
              </p>
            </td>
            <td class="px-4 py-3">
              <span
                v-if="logByDate(date)?.image_url"
                class="inline-flex items-center gap-1 text-xs text-secondary-700 dark:text-secondary-300"
              >
                <Paperclip class="h-3.5 w-3.5" aria-hidden="true" />
                1 file
              </span>
              <span v-else class="text-xs text-slate-400 dark:text-slate-500">-</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950"
                @click="emit('select', date)"
              >
                {{ logByDate(date) ? 'Edit' : 'Add' }}
                <span class="sr-only">entry for {{ formatShortDate(date) }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul class="divide-y divide-slate-200 md:hidden dark:divide-slate-800">
      <li v-for="date in dates" :key="date" class="p-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-serif text-sm font-semibold text-slate-800 dark:text-slate-100">
              {{ formatDayLabel(date) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatShortDate(date) }}</p>
          </div>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            @click="emit('select', date)"
          >
            {{ logByDate(date) ? 'Edit' : 'Add' }}
            <span class="sr-only">entry for {{ formatShortDate(date) }}</span>
          </button>
        </div>
        <p
          v-if="logByDate(date)"
          class="mt-2 line-clamp-3 font-serif text-sm text-slate-600 dark:text-slate-300"
        >
          {{ logByDate(date)?.description }}
        </p>
        <p v-else class="mt-2 text-xs italic text-slate-400 dark:text-slate-500">
          No entry recorded
        </p>
      </li>
    </ul>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { Paperclip } from '@lucide/vue'
import type { DailyLog, SubmissionStatus } from '~/types/models'
import { formatDayLabel, formatShortDate } from '~/utils/date'
import { submissionLabel, submissionTone } from '~/utils/status'

const props = defineProps<{
  dates: string[]
  logs: DailyLog[]
  activeDate: string
  status: SubmissionStatus
  weekNo: number
  rangeLabel: string
}>()

const emit = defineEmits<{ select: [date: string] }>()

const logByDate = (date: string): DailyLog | undefined =>
  props.logs.find((log) => log.log_date === date)
</script>
