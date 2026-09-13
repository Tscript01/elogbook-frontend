<template>
  <div
    id="toast-notification-region"
    aria-live="polite"
    aria-atomic="true"
    class="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 p-2 sm:bottom-6 sm:right-6"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :id="toast.id"
        :key="toast.id"
        role="status"
        class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition sm:p-4"
        :class="toneClasses[toast.tone]"
      >
        <component
          :is="toneIcons[toast.tone]"
          class="mt-0.5 h-5 w-5 shrink-0"
          :class="iconToneClasses[toast.tone]"
          aria-hidden="true"
        />

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold leading-tight">
            {{ toast.title }}
          </p>
          <p
            v-if="toast.description"
            class="mt-1 text-xs leading-normal opacity-90"
          >
            {{ toast.description }}
          </p>
        </div>

        <button
          type="button"
          class="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Dismiss notification"
          @click="remove(toast.id)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from '@lucide/vue'
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()

const toneIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const toneClasses = {
  success:
    'border-secondary-200 bg-white/95 text-slate-900 dark:border-secondary-900/60 dark:bg-slate-900/95 dark:text-slate-100',
  error:
    'border-red-200 bg-white/95 text-slate-900 dark:border-red-900/60 dark:bg-slate-900/95 dark:text-slate-100',
  warning:
    'border-amber-200 bg-white/95 text-slate-900 dark:border-amber-900/60 dark:bg-slate-900/95 dark:text-slate-100',
  info:
    'border-primary-200 bg-white/95 text-slate-900 dark:border-primary-900/60 dark:bg-slate-900/95 dark:text-slate-100'
}

const iconToneClasses = {
  success: 'text-secondary-600 dark:text-secondary-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-primary-600 dark:text-primary-400'
}
</script>
