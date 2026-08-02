<template>
  <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
    <UiBaseCard
      class="xl:col-span-2"
      title="Final clearance"
      description="Both approvals are required before your logbook is released"
    >
      <ol class="space-y-4">
        <li
          v-for="step in steps"
          :key="step.title"
          class="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            :class="
              step.status === 'CLEARED'
                ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            "
            aria-hidden="true"
          >
            <component :is="step.status === 'CLEARED' ? CheckCircle2 : Clock" class="h-4 w-4" />
          </span>
          <div class="flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ step.title }}
              </p>
              <UiBaseBadge :tone="clearanceTone[step.status]" dot>
                {{ clearanceLabel[step.status] }}
              </UiBaseBadge>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </UiBaseCard>

    <UiBaseCard title="Logbook export" description="Available after final clearance">
      <UiEmptyState
        :icon="FileText"
        title="Report not ready"
        description="Your signed PDF logbook becomes downloadable once the coordinator and ITF clear your placement."
      >
        <template #action>
          <UiBaseButton variant="outline" size="sm" disabled>Download PDF</UiBaseButton>
        </template>
      </UiEmptyState>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Clock, FileText } from '@lucide/vue'
import { computed } from 'vue'
import { useLogbookStore } from '~/stores/logbook'
import { clearanceLabel, clearanceTone } from '~/utils/status'

definePageMeta({
  layout: 'student',
  title: 'Clearance',
  breadcrumbs: [{ label: 'Clearance' }]
})

const logbook = useLogbookStore()

const steps = computed(() => [
  {
    title: 'Institution coordinator',
    description: `${logbook.placement.inst_coordinator?.name ?? 'Coordinator'} confirms that all 24 weeks are approved.`,
    status: logbook.clearance.coordinator_status
  },
  {
    title: 'ITF official',
    description: 'The Industrial Training Fund stamps the completed logbook.',
    status: logbook.clearance.itf_status
  }
])
</script>
