<template>
  <div class="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
          <BookOpenCheck class="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <h2 class="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Reset Your Password
      </h2>
      <p class="mt-1 text-center text-sm text-slate-600 dark:text-slate-400">
        Enter your institutional email to receive recovery instructions
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="border border-slate-200 bg-white px-6 py-8 shadow-paper sm:rounded-2xl sm:px-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <!-- Success State Card -->
        <div v-if="submitted" class="space-y-4">
          <div class="flex items-center justify-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <MailCheck class="h-6 w-6" />
            </div>
          </div>

          <div class="text-center">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">
              Instructions Sent
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              We have dispatched recovery details to
              <strong class="font-medium text-slate-900 dark:text-slate-200">{{ email }}</strong>.
              Please check your inbox or spam folder.
            </p>
          </div>

          <!-- Instant Test Shortcut -->
          <div
            v-if="generatedToken"
            class="rounded-xl border border-primary-200 bg-primary-50/60 p-3.5 text-xs text-primary-900 dark:border-primary-900/50 dark:bg-primary-950/40 dark:text-primary-300"
          >
            <p class="font-medium">Testing environment shortcut:</p>
            <p class="mt-1 text-[11px] opacity-90">
              A test reset token was generated. You can proceed directly to complete the reset:
            </p>
            <NuxtLink
              :to="{ path: '/reset-password', query: { token: generatedToken, email } }"
              class="mt-2.5 inline-flex items-center gap-1.5 font-semibold text-primary-700 underline hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Continue to Set New Password →
            </NuxtLink>
          </div>

          <div class="pt-2">
            <UiBaseButton
              block
              variant="outline"
              size="lg"
              @click="submitted = false"
            >
              Try another email address
            </UiBaseButton>
          </div>

          <div class="text-center text-xs">
            <NuxtLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-400">
              ← Return to sign in
            </NuxtLink>
          </div>
        </div>

        <!-- Initial Request Form -->
        <div v-else>
          <!-- Error banner -->
          <div
            v-if="errorMessage"
            class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            role="alert"
          >
            <AlertCircle class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p class="font-medium">Reset request failed</p>
              <p class="mt-0.5 opacity-90">{{ errorMessage }}</p>
            </div>
          </div>

          <form class="space-y-4" novalidate @submit.prevent="handleForgotPassword">
            <div>
              <label for="email" class="field-label">Institutional email address</label>
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

            <UiBaseButton
              type="submit"
              class="mt-2"
              block
              size="lg"
              :loading="loading"
            >
              Send reset instructions
            </UiBaseButton>
          </form>

          <!-- Quick helper -->
          <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Student account example:</span>
            <button
              type="button"
              class="font-medium text-primary-600 hover:underline dark:text-primary-400"
              @click="email = 'a.okafor@student.unilag.edu.ng'"
            >
              Fill Adaeze's email
            </button>
          </div>

          <div class="mt-4 text-center text-xs text-slate-600 dark:text-slate-400">
            Remembered your password?
            <NuxtLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-400">
              Sign in
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, BookOpenCheck, MailCheck } from '@lucide/vue'
import { ref } from 'vue'
import { apiDirectForgotPassword } from '~/utils/auth'

definePageMeta({
  title: 'Forgot Password',
  layout: false
})

const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref<string | null>(null)
const generatedToken = ref<string | null>(null)

const handleForgotPassword = async () => {
  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid institutional email address.'
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    // Direct API call without Pinia store
    const res = await apiDirectForgotPassword(email.value.trim())
    generatedToken.value = res.demoToken || 'demo_token_' + Math.random().toString(36).substring(2, 8)
    submitted.value = true
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Unable to send password reset request.'
  } finally {
    loading.value = false
  }
}
</script>
