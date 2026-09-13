<template>
  <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
    <form class="xl:col-span-2 space-y-6" novalidate @submit.prevent="save">
      <UiBaseCard title="Personal details" description="Shown on your generated logbook report">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="full-name" class="field-label">Full name</label>
            <input
              id="full-name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="field-control"
            >
          </div>
          <div>
            <label for="email" class="field-label">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="field-control"
            >
          </div>
          <div>
            <label for="phone" class="field-label">Phone number</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              class="field-control"
            >
          </div>
          <div>
            <label for="matric" class="field-label">Matriculation number</label>
            <input id="matric" v-model="form.matric_number" type="text" class="field-control" >
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard title="University details" description="Used by your institution coordinator">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="institution" class="field-label">Institution</label>
            <input
              id="institution"
              v-model="form.institution"
              type="text"
              class="field-control"
            >
          </div>
          <div>
            <label for="faculty" class="field-label">Faculty</label>
            <input id="faculty" v-model="form.faculty" type="text" class="field-control" >
          </div>
          <div>
            <label for="department" class="field-label">Department</label>
            <input id="department" v-model="form.department" type="text" class="field-control" >
          </div>
          <div>
            <label for="level" class="field-label">Level</label>
            <select id="level" v-model="form.level" class="field-control">
              <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-end gap-3">
          <p
            v-if="saved"
            class="mr-auto flex items-center gap-2 text-xs font-medium text-secondary-700 dark:text-secondary-300"
            role="status"
          >
            <CheckCircle2 class="h-4 w-4" aria-hidden="true" />
            Profile updated
          </p>
          <UiBaseButton variant="outline" :disabled="session.isLoading" @click="reset">Reset</UiBaseButton>
          <UiBaseButton type="submit" :loading="session.isLoading">
            <Save class="h-4 w-4" aria-hidden="true" />
            Save changes
          </UiBaseButton>
        </div>
      </UiBaseCard>
    </form>

    <div class="space-y-6">
      <UiBaseCard title="Account">
        <div class="flex items-center gap-3">
          <span
            class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-lg font-semibold text-white"
            aria-hidden="true"
          >
            {{ session.initials }}
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ session.user.name }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ session.roleLabel }}</p>
          </div>
        </div>
        <dl class="mt-5 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500 dark:text-slate-400">Matric number</dt>
            <dd class="font-medium text-slate-800 dark:text-slate-100">
              {{ form.matric_number }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500 dark:text-slate-400">Department</dt>
            <dd class="text-right font-medium text-slate-800 dark:text-slate-100">
              {{ form.department }}
            </dd>
          </div>
        </dl>
      </UiBaseCard>

      <UiBaseCard title="Security" description="Keep your account protected">
        <UiBaseButton variant="outline" size="sm" block>Change password</UiBaseButton>
        <p class="field-hint mt-3">
          You will be asked to confirm your current password before a new one is applied.
        </p>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Save } from '@lucide/vue'
import { reactive, ref } from 'vue'
import { useSessionStore } from '~/stores/session'

definePageMeta({
  layout: 'student',
  title: 'Profile settings',
  breadcrumbs: [{ label: 'Profile settings' }]
})

const session = useSessionStore()

const levels = ['200', '300', '400', '500']

const initialForm = () => ({
  name: session.user.name,
  email: session.user.email,
  phone: session.profile.phone,
  matric_number: session.profile.matric_number,
  institution: session.profile.institution,
  faculty: session.profile.faculty,
  department: session.profile.department,
  level: session.profile.level
})

const form = reactive(initialForm())
const saved = ref(false)

const reset = () => {
  Object.assign(form, initialForm())
  saved.value = false
}

const save = async () => {
  await session.updateProfile({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    matric_number: form.matric_number.trim(),
    institution: form.institution.trim(),
    faculty: form.faculty.trim(),
    department: form.department.trim(),
    level: form.level
  })
  saved.value = true
}
</script>
