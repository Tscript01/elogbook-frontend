<template>
  <div class="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
    <div class="sm:mx-auto sm:w-full sm:max-w-xl">
      <div class="flex justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
          <BookOpenCheck class="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <h2 class="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Create Student Account
      </h2>
      <p class="mt-1 text-center text-sm text-slate-600 dark:text-slate-400">
        Register your SIWES industrial training electronic logbook
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
      <div class="border border-slate-200 bg-white px-6 py-8 shadow-paper sm:rounded-2xl sm:px-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div
          v-if="errorMessage"
          class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          <AlertCircle class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p class="font-medium">Registration failed</p>
            <p class="mt-0.5 opacity-90">{{ errorMessage }}</p>
          </div>
        </div>

        <form class="space-y-4" novalidate @submit.prevent="handleRegister">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="name" class="field-label">Full name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Adaeze Okafor"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="email" class="field-label">Institutional email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="a.okafor@student.unilag.edu.ng"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="password" class="field-label">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="Minimum 8 characters"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="matric" class="field-label">Matriculation number</label>
              <input
                id="matric"
                v-model="form.matric_number"
                type="text"
                required
                placeholder="190401052"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="phone" class="field-label">Phone number</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+234 803 123 4567"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div class="sm:col-span-2">
              <label for="institution" class="field-label">Institution / University</label>
              <input
                id="institution"
                v-model="form.institution"
                type="text"
                required
                placeholder="University of Lagos"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="department" class="field-label">Department</label>
              <input
                id="department"
                v-model="form.department"
                type="text"
                required
                placeholder="Computer Engineering"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="level" class="field-label">Study level</label>
              <select id="level" v-model="form.level" class="field-control" :disabled="loading">
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
          </div>

          <UiBaseButton
            type="submit"
            class="mt-4"
            block
            size="lg"
            :loading="loading"
          >
            Create account & launch logbook
          </UiBaseButton>
        </form>

        <div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          Already registered?
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Sign in here
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, BookOpenCheck } from '@lucide/vue'
import { reactive, ref } from 'vue'
import { useSessionStore } from '~/stores/session'

definePageMeta({
  title: 'Register',
  layout: false
})

const session = useSessionStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  matric_number: '',
  phone: '',
  institution: '',
  department: '',
  level: '400'
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

const handleRegister = async () => {
  if (!form.name || !form.email || !form.password) {
    errorMessage.value = 'Please complete all required fields.'
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    await session.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      matric_number: form.matric_number.trim(),
      phone: form.phone.trim(),
      institution: form.institution.trim(),
      department: form.department.trim(),
      level: form.level,
      role: 'STUDENT'
    })
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Registration request failed.'
  } finally {
    loading.value = false
  }
}
</script>
