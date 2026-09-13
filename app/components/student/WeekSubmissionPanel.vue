<template>
  <UiBaseCard title="Weekly submission" description="Send this week to your industry supervisor">
    <dl class="space-y-3 text-sm">
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500 dark:text-slate-400">Entries completed</dt>
        <dd class="font-medium text-slate-800 dark:text-slate-100">{{ completed }} of 5</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500 dark:text-slate-400">Status</dt>
        <dd>
          <UiBaseBadge :tone="submissionTone[status]" dot>{{ submissionLabel[status] }}</UiBaseBadge>
        </dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500 dark:text-slate-400">Reviewer</dt>
        <dd class="text-right font-medium text-slate-800 dark:text-slate-100">{{ supervisor }}</dd>
      </div>
    </dl>

    <UiProgressBar
      class="mt-4"
      tone="secondary"
      :value="(completed / 5) * 100"
      label="Entries completed this week"
    />

    <p
      v-if="status === 'REJECTED'"
      class="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/60 dark:text-red-300"
    >
      <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      Your supervisor requested changes. Update the flagged entries and submit again.
    </p>

    <p
      v-else-if="completed < 5"
      class="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
    >
      <Info class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      All five working days must be filled before this week can be submitted.
    </p>

    <UiBaseButton
      class="mt-4"
      block
      :disabled="completed < 5 || locked"
      :loading="submitting"
      @click="emit('submit')"
    >
      <Send class="h-4 w-4" aria-hidden="true" />
      {{ locked ? 'Already submitted' : 'Submit week for review' }}
    </UiBaseButton>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { AlertTriangle, Info, Send } from '@lucide/vue'
import type { SubmissionStatus } from '~/types/models'
import { submissionLabel, submissionTone } from '~/utils/status'

withDefaults(
  defineProps<{
    completed: number
    status: SubmissionStatus
    supervisor: string
    locked: boolean
    submitting?: boolean
  }>(),
  { submitting: false }
)

const emit = defineEmits<{ submit: [] }>()
</script>
