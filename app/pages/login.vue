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
        <!-- Success/Info Notice (from redirect or registration) -->
        <div
          v-if="noticeMessage"
          class="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p class="font-medium">{{ noticeMessage }}</p>
          </div>
        </div>

        <!-- Auth Middleware Protected Page Redirect Banner -->
        <div
          v-if="redirectReason"
          class="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
          role="status"
        >
          <Info class="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p class="font-medium">Authentication required</p>
            <p class="mt-0.5 opacity-90">Please sign in to access your requested page.</p>
          </div>
        </div>

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
              <NuxtLink
                to="/forgot-password"
                class="text-xs text-primary-600 hover:underline dark:text-primary-400"
              >
                Forgot password?
              </NuxtLink>
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
            <span>Or bypass server:</span>
            <button
              type="button"
              class="font-medium text-primary-600 hover:underline dark:text-primary-400"
              @click="directDemoLogin"
            >
              Direct Student Sign-in →
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
import { AlertCircle, BookOpenCheck, CheckCircle2, Info } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { mockStudent, mockStudentProfile } from '~/data/mock-student'
import { apiDirectLogin, saveDirectAuth } from '~/utils/auth'

definePageMeta({
  title: 'Sign In',
  layout: false
})

const route = useRoute()

const email = ref('a.okafor@student.unilag.edu.ng')
const password = ref('password123')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const redirectReason = computed(() => Boolean(route.query.redirect))

const noticeMessage = computed(() => {
  if (route.query.registered === 'true') {
    return 'Your account was registered successfully! Please sign in below.'
  }
  if (route.query.reset === 'true') {
    return 'Password updated successfully! Please sign in with your new password.'
  }
  return null
})

onMounted(() => {
  if (route.query.email && typeof route.query.email === 'string') {
    email.value = route.query.email
  }
})

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
    // Direct API call without Pinia state management
    const result = await apiDirectLogin({
      email: email.value.trim(),
      password: password.value
    })

    // Store auth directly in universal cookie & localStorage
    saveDirectAuth(result.token, result.user, result.profile)

    const destination = (route.query.redirect as string) || '/student'
    await navigateTo(destination)
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : 'Invalid credentials or API server not reachable.'

    // If connection refused or endpoint unavailable, offer clear guidance
    if (rawMsg.includes('Failed to fetch') || rawMsg.includes('fetch failed') || rawMsg.includes('ECONNREFUSED')) {
      errorMessage.value = 'Backend server is unreachable at the configured API base. You can click "Direct Student Sign-in" below to test the app without an active backend.'
    } else {
      errorMessage.value = rawMsg
    }
  } finally {
    loading.value = false
  }
}

const directDemoLogin = async () => {
  // Direct authentication with sample user, bypasses store
  saveDirectAuth(
    'demo_jwt_token_' + Date.now(),
    {
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      role: mockStudent.role,
      avatar_url: mockStudentProfile.avatar_url
    },
    mockStudentProfile
  )

  const destination = (route.query.redirect as string) || '/student'
  await navigateTo(destination)
}
</script>
