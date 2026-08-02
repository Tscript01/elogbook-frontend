<template>
  <div
    class="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div
      class="h-full rounded-full transition-all duration-500"
      :class="tone === 'secondary' ? 'bg-secondary-500' : 'bg-primary-600'"
      :style="{ width: `${clamped}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    label: string
    tone?: 'primary' | 'secondary'
  }>(),
  { tone: 'primary' }
)

const clamped = computed(() => Math.min(Math.max(Math.round(props.value), 0), 100))
</script>
