<template>
  <button
    type="button"
    class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <ClientOnly>
      <Moon v-if="isDark" class="h-5 w-5" aria-hidden="true" />
      <Sun v-else class="h-5 w-5" aria-hidden="true" />
      <template #fallback>
        <Sun class="h-5 w-5" aria-hidden="true" />
      </template>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { computed } from 'vue'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggle = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
