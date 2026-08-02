<template>
  <div>
    <div
      v-if="open"
      class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
      aria-hidden="true"
      @click="emit('close')"
    />

    <aside
      id="primary-navigation"
      class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between gap-3 px-5 py-4">
        <NuxtLink :to="homeLink" class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white"
            aria-hidden="true"
          >
            <BookOpenCheck class="h-5 w-5" />
          </span>
          <span class="leading-tight">
            <span class="block text-sm font-semibold text-slate-900 dark:text-white">
              SIWES E-Logbook
            </span>
            <span class="block text-xs text-slate-500 dark:text-slate-400">{{ roleLabel }}</span>
          </span>
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Close navigation menu"
          @click="emit('close')"
        >
          <X class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 pb-4" aria-label="Main navigation">
        <div v-for="section in sections" :key="section.title" class="mb-6">
          <p
            class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            {{ section.title }}
          </p>
          <ul class="space-y-1">
            <li v-for="item in section.items" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                active-class="bg-primary-50 text-primary-700 hover:bg-primary-50 dark:bg-primary-950 dark:text-primary-200"
                @click="emit('close')"
              >
                <component :is="item.icon" class="h-[18px] w-[18px]" aria-hidden="true" />
                <span class="flex-1">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-semibold text-white"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="border-t border-slate-200 p-4 dark:border-slate-800">
        <slot name="footer" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { BookOpenCheck, X } from '@lucide/vue'
import type { NavSection } from '~/types/ui'

withDefaults(
  defineProps<{
    sections: NavSection[]
    open: boolean
    roleLabel: string
    homeLink?: string
  }>(),
  { homeLink: '/' }
)

const emit = defineEmits<{ close: [] }>()
</script>
