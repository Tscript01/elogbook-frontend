<template>
  <div class="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
          <BookOpenCheck class="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <h2 class="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        SIWES E-Logbook
      </h2>
      <p class="mt-1 text-center text-sm text-slate-600 dark:text-slate-400">
        Sign in to access your electronic industrial training logbook
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="border border-slate-200 bg-white px-6 py-8 shadow-paper sm:rounded-2xl sm:px-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <!-- Error Banner -->
        <div
          v-if="errorMessage"
          class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          <AlertCircle class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p class="font-medium">Sign-in error</p>
            <p class="mt-0.5 opacity-90">{{ errorMessage }}</p>
          </div>
        </div>

        <form class="space-y-4" novalidate @submit.prevent="handleLogin">
          <div>
            <label for="email" class="field-label">Institutional email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="student@university.edu.ng"
              class="field-control"
              :disabled="loading"
            >
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="field-label mb-0">Password</label>
              <a href="#" class="text-xs text-primary-600 hover:underline dark:text-primary-400">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="field-control mt-1.5"
              :disabled="loading"
            >
          </div>

          <UiBaseButton
            type="submit"
            class="mt-2"
            block
            size="lg"
            :loading="loading"
          >
            Sign in
          </UiBaseButton>
        </form>

        <!-- Quick Demo Accounts -->
        <div class="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Testing Credentials
          </p>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-200 p-2 text-left text-xs transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              @click="fillDemo('a.okafor@student.unilag.edu.ng', 'password123')"
            >
              <span class="block font-medium text-slate-800 dark:text-slate-200">Adaeze Okafor</span>
              <span class="block text-[11px] text-slate-500">Student</span>
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-200 p-2 text-left text-xs transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              @click="fillDemo('tunde.bakare@zenithcore.ng', 'password123')"
            >
              <span class="block font-medium text-slate-800 dark:text-slate-200">Engr. Bakare</span>
              <span class="block text-[11px] text-slate-500">Supervisor</span>
            </button>
          </div>

          <div class="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Or test without backend:</span>
            <button
              type="button"
              class="font-medium text-primary-600 hover:underline dark:text-primary-400"
              @click="launchOfflineDemo"
            >
              Enter as Demo Student →
            </button>
          </div>
        </div>

        <div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Register for SIWES
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, BookOpenCheck } from '@lucide/vue'
import { ref } from 'vue'
import { useSessionStore } from '~/stores/session'

definePageMeta({
  title: 'Sign In',
  layout: false
})

const session = useSessionStore()

const email = ref('a.okafor@student.unilag.edu.ng')
const password = ref('password123')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const fillDemo = (demoEmail: string, demoPass: string) => {
  email.value = demoEmail
  password.value = demoPass
  errorMessage.value = null
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both your email address and password.'
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    await session.login({
      email: email.value.trim(),
      password: password.value
    })
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Invalid credentials or API server not reachable.'
  } finally {
    loading.value = false
  }
}

const launchOfflineDemo = async () => {
  session.loadDemoUser()
  await navigateTo('/student')
}
</script>
