<template>
  <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
    <form class="xl:col-span-2" novalidate @submit.prevent="save">
      <UiBaseCard
        title="Placement details"
        description="Provide the organisation hosting your industrial training"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="company-name" class="field-label">Company name</label>
            <input
              id="company-name"
              v-model="form.company_name"
              type="text"
              required
              autocomplete="organization"
              class="field-control"
              :aria-invalid="Boolean(errors.company_name)"
              aria-describedby="company-name-error"
            >
            <p
              v-if="errors.company_name"
              id="company-name-error"
              class="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.company_name }}
            </p>
          </div>

          <div class="sm:col-span-2">
            <label for="company-address" class="field-label">Company address</label>
            <textarea
              id="company-address"
              v-model="form.company_address"
              rows="3"
              class="field-control"
              autocomplete="street-address"
            />
          </div>

          <div>
            <label for="company-email" class="field-label">Company email</label>
            <input
              id="company-email"
              v-model="form.company_email"
              type="email"
              class="field-control"
              autocomplete="email"
            >
          </div>

          <div>
            <label for="company-contact" class="field-label">Company phone number</label>
            <input
              id="company-contact"
              v-model="form.company_contact"
              type="tel"
              class="field-control"
              autocomplete="tel"
            >
          </div>

          <div class="sm:col-span-2">
            <label for="supervisor-email" class="field-label">Industry supervisor email</label>
            <input
              id="supervisor-email"
              v-model="form.supervisor_email"
              type="email"
              required
              class="field-control"
              :aria-invalid="Boolean(errors.supervisor_email)"
              aria-describedby="supervisor-email-hint supervisor-email-error"
            >
            <p id="supervisor-email-hint" class="field-hint">
              An invitation to review your logbook is sent to this address.
            </p>
            <p
              v-if="errors.supervisor_email"
              id="supervisor-email-error"
              class="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.supervisor_email }}
            </p>
          </div>

          <div>
            <label for="start-date" class="field-label">Training start date</label>
            <input
              id="start-date"
              v-model="form.start_date"
              type="date"
              required
              class="field-control"
            >
          </div>

          <div>
            <label for="end-date" class="field-label">Training end date</label>
            <input
              id="end-date"
              v-model="form.end_date"
              type="date"
              required
              class="field-control"
              :aria-invalid="Boolean(errors.end_date)"
              aria-describedby="end-date-error"
            >
            <p
              v-if="errors.end_date"
              id="end-date-error"
              class="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.end_date }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-end gap-3">
          <p
            v-if="saved"
            class="mr-auto flex items-center gap-2 text-xs font-medium text-secondary-700 dark:text-secondary-300"
            role="status"
          >
            <CheckCircle2 class="h-4 w-4" aria-hidden="true" />
            Placement details saved
          </p>
          <UiBaseButton variant="outline" @click="reset">Reset</UiBaseButton>
          <UiBaseButton type="submit">
            <Save class="h-4 w-4" aria-hidden="true" />
            Save placement
          </UiBaseButton>
        </div>
      </UiBaseCard>
    </form>

    <div class="space-y-6">
      <UiBaseCard title="Duration" description="Calculated from your dates">
        <p class="text-3xl font-semibold text-slate-900 dark:text-white">{{ weekCount }}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">weeks of industrial training</p>
        <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">
          SIWES placements normally run for 24 weeks. Your coordinator is notified if the duration
          falls short.
        </p>
      </UiBaseCard>

      <UiBaseCard title="Assigned reviewers">
        <ul class="space-y-4 text-sm">
          <li>
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Industry supervisor
            </p>
            <p class="font-medium text-slate-800 dark:text-slate-100">
              {{ logbook.placement.ind_supervisor.name }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ logbook.placement.ind_supervisor.email }}
            </p>
          </li>
          <li>
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Institution coordinator
            </p>
            <p class="font-medium text-slate-800 dark:text-slate-100">
              {{ logbook.placement.inst_coordinator?.name ?? 'Not assigned' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ logbook.placement.inst_coordinator?.email ?? 'Awaiting allocation' }}
            </p>
          </li>
        </ul>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Save } from '@lucide/vue'
import { computed, reactive, ref } from 'vue'
import { useLogbookStore } from '~/stores/logbook'
import { daysBetween } from '~/utils/date'

definePageMeta({
  layout: 'student',
  title: 'Placement setup',
  breadcrumbs: [{ label: 'Placement details' }]
})

const logbook = useLogbookStore()

const initialForm = () => ({
  company_name: logbook.placement.company_name,
  company_address: logbook.placement.company_address ?? '',
  company_email: logbook.placement.company_email ?? '',
  company_contact: logbook.placement.company_contact ?? '',
  supervisor_email: logbook.placement.ind_supervisor.email,
  start_date: logbook.placement.start_date,
  end_date: logbook.placement.end_date
})

const form = reactive(initialForm())
const errors = ref<Record<string, string>>({})
const saved = ref(false)

const weekCount = computed(() => {
  const days = daysBetween(form.start_date, form.end_date)
  return days > 0 ? Math.ceil(days / 7) : 0
})

const reset = () => {
  Object.assign(form, initialForm())
  errors.value = {}
  saved.value = false
}

const save = () => {
  const next: Record<string, string> = {}

  if (form.company_name.trim().length < 2) {
    next.company_name = 'Enter the name of the organisation.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supervisor_email)) {
    next.supervisor_email = 'Enter a valid supervisor email address.'
  }
  if (daysBetween(form.start_date, form.end_date) <= 0) {
    next.end_date = 'The end date must come after the start date.'
  }

  errors.value = next

  if (Object.keys(next).length > 0) {
    saved.value = false
    return
  }

  logbook.placement = {
    ...logbook.placement,
    company_name: form.company_name.trim(),
    company_address: form.company_address.trim() || null,
    company_email: form.company_email.trim() || null,
    company_contact: form.company_contact.trim() || null,
    start_date: form.start_date,
    end_date: form.end_date
  }
  saved.value = true
}
</script>
