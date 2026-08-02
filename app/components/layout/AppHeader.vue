<template>
  <header
    class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
  >
    <div class="flex items-center gap-3 px-4 py-3 sm:px-6">
      <button
        type="button"
        class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="Open navigation menu"
        aria-controls="primary-navigation"
        @click="emit('toggle-sidebar')"
      >
        <Menu class="h-5 w-5" aria-hidden="true" />
      </button>

      <div class="min-w-0 flex-1">
        <LayoutAppBreadcrumbs :items="breadcrumbs" />
        <h1 class="truncate text-lg font-semibold text-slate-900 dark:text-white">{{ title }}</h1>
      </div>

      <div class="hidden md:block">
        <label for="global-search" class="sr-only">Search the logbook</label>
        <div class="relative">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            placeholder="Search entries, weeks"
            class="field-control w-56 pl-9 lg:w-72"
          >
        </div>
      </div>

      <button
        type="button"
        class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        :aria-label="`Notifications, ${notificationCount} unread`"
      >
        <Bell class="h-5 w-5" aria-hidden="true" />
        <span
          v-if="notificationCount"
          class="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"
          aria-hidden="true"
        />
      </button>

      <LayoutThemeToggle />

      <LayoutUserMenu
        :name="user.name"
        :email="user.email"
        :role-label="roleLabel"
        :initials="initials"
        @sign-out="emit('sign-out')"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, Menu, Search } from '@lucide/vue'
import type { Breadcrumb, SessionUser } from '~/types/ui'

withDefaults(
  defineProps<{
    title: string
    breadcrumbs: Breadcrumb[]
    user: SessionUser
    roleLabel: string
    initials: string
    notificationCount?: number
  }>(),
  { notificationCount: 0 }
)

const emit = defineEmits<{ 'toggle-sidebar': []; 'sign-out': [] }>()
</script>
