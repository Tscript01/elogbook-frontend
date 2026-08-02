<template>
  <article
    class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
  >
    <header class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Week {{ weekNo }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ supervisor }} - {{ formatShortDate(approval.approval_timestamp) }}
        </p>
      </div>
      <UiBaseBadge :tone="approval.grade === null ? 'danger' : 'success'">
        {{ approval.grade === null ? 'Changes requested' : `${approval.grade}/100` }}
      </UiBaseBadge>
    </header>

    <p class="mt-3 font-serif text-sm leading-relaxed text-slate-600 dark:text-slate-300">
      {{ approval.feedback }}
    </p>

    <p
      v-if="approval.cryptographic_signature_hash"
      class="mt-3 truncate font-mono text-[11px] text-slate-400 dark:text-slate-500"
    >
      Signature {{ approval.cryptographic_signature_hash.slice(0, 24) }}
    </p>
  </article>
</template>

<script setup lang="ts">
import type { LogBookApproval } from '~/types/models'
import { formatShortDate } from '~/utils/date'

defineProps<{
  approval: LogBookApproval
  weekNo: number
  supervisor: string
}>()
</script>
