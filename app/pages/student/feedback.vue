<template>
  <UiBaseCard title="Supervisor feedback" description="All reviews received so far">
    <div v-if="feedback.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <StudentSupervisorFeedbackCard
        v-for="approval in feedback"
        :key="approval.id"
        :approval="approval"
        :week-no="weekNoFor(approval.weekly_submission_id)"
        :supervisor="logbook.placement.ind_supervisor.name"
      />
    </div>
    <UiEmptyState
      v-else
      :icon="MessageSquareQuote"
      title="No feedback yet"
      description="Once a week is reviewed, your supervisor comments appear here."
    />
  </UiBaseCard>
</template>

<script setup lang="ts">
import { MessageSquareQuote } from '@lucide/vue'
import { computed } from 'vue'
import { useLogbookStore } from '~/stores/logbook'

definePageMeta({
  layout: 'student',
  title: 'Feedback',
  breadcrumbs: [{ label: 'Feedback' }]
})

const logbook = useLogbookStore()

const feedback = computed(() =>
  [...logbook.approvals]
    .filter((approval) => Boolean(approval.feedback))
    .sort((a, b) => b.approval_timestamp.localeCompare(a.approval_timestamp))
)

const weekNoFor = (submissionId: string): number =>
  logbook.submissions.find((submission) => submission.id === submissionId)?.week_no ?? 0
</script>
