<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
    :class="toneClasses[tone]"
  >
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full" :class="dotClasses[tone]" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { BadgeTone } from '~/utils/status'

withDefaults(
  defineProps<{
    tone?: BadgeTone
    dot?: boolean
  }>(),
  { tone: 'neutral', dot: false }
)

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  info: 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300',
  success:
    'border-secondary-200 bg-secondary-50 text-secondary-700 dark:border-secondary-900 dark:bg-secondary-950 dark:text-secondary-300',
  warning:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  danger: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
}

const dotClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-400',
  info: 'bg-primary-500',
  success: 'bg-secondary-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500'
}
</script>
