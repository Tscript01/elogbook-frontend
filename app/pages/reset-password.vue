<template>
  <div class="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
          <BookOpenCheck class="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <h2 class="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Set New Password
      </h2>
      <p class="mt-1 text-center text-sm text-slate-600 dark:text-slate-400">
        Choose a secure password for your SIWES account
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="border border-slate-200 bg-white px-6 py-8 shadow-paper sm:rounded-2xl sm:px-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <!-- Success State -->
        <div v-if="success" class="space-y-4 text-center">
          <div class="flex justify-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 class="h-6 w-6" />
            </div>
          </div>

          <div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">
              Password Changed Successfully
            </h3>
            <p class="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Your credentials have been updated. You can now access your logbook with your new password.
            </p>
          </div>

          <div class="pt-3">
            <UiBaseButton
              block
              size="lg"
              @click="navigateTo('/login?reset=true')"
            >
              Sign in with new password
            </UiBaseButton>
          </div>
        </div>

        <!-- Reset Form -->
        <div v-else>
          <!-- Error banner -->
          <div
            v-if="errorMessage"
            class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            role="alert"
          >
            <AlertCircle class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p class="font-medium">Reset failed</p>
              <p class="mt-0.5 opacity-90">{{ errorMessage }}</p>
            </div>
          </div>

          <form class="space-y-4" novalidate @submit.prevent="handleResetPassword">
            <div>
              <label for="token" class="field-label">Verification / Reset token</label>
              <input
                id="token"
                v-model="token"
                type="text"
                required
                placeholder="Paste your reset token or code"
                class="field-control font-mono text-xs"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="password" class="field-label">New password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="new-password"
                placeholder="Minimum 8 characters"
                class="field-control"
                :disabled="loading"
              >
            </div>

            <div>
              <label for="confirm-password" class="field-label">Confirm new password</label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                placeholder="Re-enter password"
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
              Update password
            </UiBaseButton>
          </form>

          <div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
            Remember your credentials?
            <NuxtLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-400">
              Back to sign in
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, BookOpenCheck, CheckCircle2 } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiDirectResetPassword } from '~/utils/auth'

definePageMeta({
  title: 'Reset Password',
  layout: false
})

const route = useRoute()

const token = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref<string | null>(null)

onMounted(() => {
  if (route.query.token && typeof route.query.token === 'string') {
    token.value = route.query.token
  }
})

const handleResetPassword = async () => {
  if (!token.value.trim()) {
    errorMessage.value = 'Please provide a valid reset token or link.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'New password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match. Please re-check.'
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    // Direct API call without Pinia store
    await apiDirectResetPassword({
      token: token.value.trim(),
      password: password.value
    })
    success.value = true
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>
