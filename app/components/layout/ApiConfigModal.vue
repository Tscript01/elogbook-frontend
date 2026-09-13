<template>
  <div>
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-config-title"
    >
      <div
        class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300"
            >
              <Server class="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="api-config-title" class="text-base font-semibold text-slate-900 dark:text-white">
                API Backend Connection
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Configure your connection to <code class="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">elogbookserver2</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close dialog"
            @click="emit('close')"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="mt-5 space-y-4">
          <!-- Live Mode Toggle -->
          <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-200">Live API Requests</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Send network requests to your backend server instead of offline simulation.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="liveMode"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :class="liveMode ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'"
              @click="toggleLiveMode"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="liveMode ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <!-- API Base URL Input -->
          <div>
            <label for="api-base-url" class="field-label flex items-center justify-between">
              <span>API Base URL</span>
              <span class="text-xs font-normal text-slate-400">
                Env default: {{ defaultEnvBase }}
              </span>
            </label>
            <div class="flex gap-2">
              <input
                id="api-base-url"
                v-model="urlInput"
                type="url"
                placeholder="http://localhost:5000/api"
                class="field-control flex-1 font-mono text-xs"
              >
              <UiBaseButton
                variant="outline"
                size="md"
                :loading="testing"
                @click="runTest"
              >
                <Activity class="h-4 w-4" />
                Test
              </UiBaseButton>
            </div>
            <p class="field-hint">
              Example: <code>http://localhost:5000/api</code> or <code>http://127.0.0.1:8000/api</code>
            </p>
          </div>

          <!-- Test Result Banner -->
          <div
            v-if="testResult"
            class="rounded-xl border p-3.5 text-xs transition"
            :class="
              testResult.success
                ? 'border-secondary-200 bg-secondary-50/80 text-secondary-800 dark:border-secondary-900/60 dark:bg-secondary-950/40 dark:text-secondary-300'
                : 'border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200'
            "
          >
            <div class="flex items-center gap-2 font-medium">
              <component
                :is="testResult.success ? CheckCircle2 : AlertTriangle"
                class="h-4 w-4 shrink-0"
              />
              <span>{{ testResult.success ? 'Backend Reachable' : 'Connection Warning' }}</span>
              <span v-if="testResult.latencyMs" class="ml-auto opacity-75">
                {{ testResult.latencyMs }}ms
              </span>
            </div>
            <p class="mt-1 text-[11px] leading-relaxed opacity-90">
              {{ testResult.message }}
            </p>
          </div>

          <!-- Authentication Status -->
          <div class="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-slate-300">Auth Token Status</span>
              <span
                class="inline-flex items-center gap-1.5 font-medium"
                :class="token ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-400'"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="token ? 'bg-secondary-500' : 'bg-slate-300 dark:bg-slate-600'"
                />
                {{ token ? 'Bearer Token Active' : 'No Token (Anonymous / Demo)' }}
              </span>
            </div>
            <p v-if="token" class="mt-1 truncate font-mono text-[10px] text-slate-400">
              {{ token }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            class="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            @click="resetToDefault"
          >
            Reset to default
          </button>
          <div class="flex items-center gap-2">
            <UiBaseButton variant="outline" size="sm" @click="emit('close')">
              Cancel
            </UiBaseButton>
            <UiBaseButton size="sm" @click="saveSettings">
              Save & Apply
            </UiBaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Activity, AlertTriangle, CheckCircle2, Server, X } from '@lucide/vue'
import { ref, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useLogbookStore } from '~/stores/logbook'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const config = useRuntimeConfig()
const defaultEnvBase = (config.public.apiBase as string) || 'http://localhost:5000/api'

const api = useApi()
const toast = useToast()
const logbook = useLogbookStore()

const urlInput = ref(api.apiBaseUrl.value)
const liveMode = ref(api.liveMode.value)
const token = ref(api.token.value)
const testing = ref(false)
const testResult = ref<{ success: boolean; message: string; latencyMs: number } | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      urlInput.value = api.apiBaseUrl.value
      liveMode.value = api.liveMode.value
      token.value = api.token.value
      testResult.value = null
    }
  }
)

const toggleLiveMode = () => {
  liveMode.value = !liveMode.value
}

const runTest = async () => {
  testing.value = true
  testResult.value = null
  try {
    const res = await api.testConnection(urlInput.value)
    testResult.value = res
  } finally {
    testing.value = false
  }
}

const resetToDefault = () => {
  urlInput.value = defaultEnvBase
  api.resetApiBaseUrl()
  testResult.value = null
  toast.info('Reset API URL', `Reset to default: ${defaultEnvBase}`)
}

const saveSettings = async () => {
  api.updateApiBaseUrl(urlInput.value)
  api.setLiveMode(liveMode.value)
  toast.success('Settings updated', `Targeting API at ${urlInput.value}`)
  emit('close')

  // Try refreshing data from new URL
  if (liveMode.value) {
    await logbook.loadInitialData()
  }
}
</script>
