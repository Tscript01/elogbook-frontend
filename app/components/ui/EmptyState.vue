<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700"
  >
    <span
      class="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      aria-hidden="true"
    >
      <component :is="icon" class="h-5 w-5" />
    </span>
    <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ title }}</p>
    <p v-if="description" class="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    icon: Component
  }>(),
  { description: '' }
)
</script>
