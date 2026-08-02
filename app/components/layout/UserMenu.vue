<template>
  <div ref="root" class="relative">
    <button
      id="user-menu-button"
      type="button"
      class="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      :aria-expanded="open"
      aria-haspopup="menu"
      aria-controls="user-menu"
      @click="open = !open"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white"
        aria-hidden="true"
      >
        {{ initials }}
      </span>
      <span class="hidden text-left sm:block">
        <span class="block text-sm font-medium leading-tight text-slate-800 dark:text-slate-100">
          {{ name }}
        </span>
        <span class="block text-xs leading-tight text-slate-500 dark:text-slate-400">
          {{ roleLabel }}
        </span>
      </span>
    </button>

    <div
      v-if="open"
      id="user-menu"
      role="menu"
      aria-labelledby="user-menu-button"
      class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-paper dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ name }}</p>
        <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ email }}</p>
      </div>
      <NuxtLink
        to="/student/profile"
        role="menuitem"
        class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        @click="open = false"
      >
        <UserCog class="h-4 w-4" aria-hidden="true" />
        Profile settings
      </NuxtLink>
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        @click="signOut"
      >
        <LogOut class="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogOut, UserCog } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{
  name: string
  email: string
  roleLabel: string
  initials: string
}>()

const emit = defineEmits<{ 'sign-out': [] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const signOut = () => {
  open.value = false
  emit('sign-out')
}

const handleOutside = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) {
    open.value = false
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', handleOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
