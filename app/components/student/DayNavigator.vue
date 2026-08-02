<template>
  <div class="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Days of the selected week">
    <button
      v-for="date in dates"
      :key="date"
      type="button"
      role="tab"
      :aria-selected="date === activeDate"
      :tabindex="date === activeDate ? 0 : -1"
      class="flex min-w-[84px] flex-1 flex-col items-center gap-1 rounded-xl border px-3 py-3 transition"
      :class="
        date === activeDate
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
      "
      @click="emit('select', date)"
    >
      <span class="text-[11px] font-medium uppercase tracking-wide">{{ formatDayLabel(date) }}</span>
      <span class="text-lg font-semibold leading-none">{{ formatDayNumber(date) }}</span>
      <span
        class="mt-0.5 flex h-4 items-center text-[10px] font-medium"
        :class="date === activeDate ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'"
      >
        <CheckCircle2 v-if="filledDates.includes(date)" class="h-3.5 w-3.5" aria-hidden="true" />
        <span v-else>Empty</span>
        <span v-if="filledDates.includes(date)" class="sr-only">Entry recorded</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2 } from '@lucide/vue'
import { formatDayLabel, formatDayNumber } from '~/utils/date'

defineProps<{
  dates: string[]
  activeDate: string
  filledDates: string[]
}>()

const emit = defineEmits<{ select: [date: string] }>()
</script>
