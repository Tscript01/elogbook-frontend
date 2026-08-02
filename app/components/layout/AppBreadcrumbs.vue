<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
      <li v-for="(crumb, index) in items" :key="`${crumb.label}-${index}`" class="flex items-center gap-1">
        <ChevronRight v-if="index > 0" class="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" aria-hidden="true" />
        <NuxtLink
          v-if="crumb.to && index < items.length - 1"
          :to="crumb.to"
          class="rounded transition hover:text-slate-800 dark:hover:text-slate-200"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-else
          class="font-medium text-slate-700 dark:text-slate-300"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import type { Breadcrumb } from '~/types/ui'

defineProps<{ items: Breadcrumb[] }>()
</script>
