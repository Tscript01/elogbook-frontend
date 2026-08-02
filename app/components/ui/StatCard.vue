<template>
  <div class="paper-sheet flex items-start justify-between gap-4 p-4 sm:p-5">
    <div>
      <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {{ label }}
      </p>
      <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ value }}</p>
      <p v-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
    </div>
    <span
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
      :class="toneClasses[tone]"
      aria-hidden="true"
    >
      <component :is="icon" class="h-5 w-5" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    hint?: string
    icon: Component
    tone?: 'primary' | 'secondary' | 'amber' | 'slate'
  }>(),
  { hint: '', tone: 'primary' }
)

const toneClasses = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300',
  secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-950 dark:text-secondary-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}
</script>
