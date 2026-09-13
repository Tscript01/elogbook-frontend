<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <LayoutAppSidebar
      :sections="sections"
      :open="sidebarOpen"
      :role-label="session.roleLabel"
      home-link="/student"
      @close="sidebarOpen = false"
    >
      <template #footer>
        <div class="rounded-lg bg-primary-50 p-3 dark:bg-primary-950/60">
          <p class="text-xs font-semibold text-primary-800 dark:text-primary-200">
            Week {{ logbook.activeWeekNo }} of {{ logbook.totalWeeks }}
          </p>
          <p class="mt-1 text-[11px] text-primary-700/80 dark:text-primary-300/80">
            {{ logbook.placement.company_name }}
          </p>
          <UiProgressBar
            class="mt-3"
            :value="weekProgress"
            label="Industrial training progress"
          />
        </div>
      </template>
    </LayoutAppSidebar>

    <div class="lg:pl-72">
      <LayoutAppHeader
        :title="pageTitle"
        :breadcrumbs="breadcrumbs"
        :user="session.user"
        :role-label="session.roleLabel"
        :initials="session.initials"
        :notification-count="logbook.pendingEntries"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @sign-out="signOut"
      />

      <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
  NotebookPen,
  UserCog
} from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLogbookStore } from '~/stores/logbook'
import { useSessionStore } from '~/stores/session'
import type { Breadcrumb, NavSection } from '~/types/ui'

const route = useRoute()
const session = useSessionStore()
const logbook = useLogbookStore()

const sidebarOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  }
)

const sections = computed<NavSection[]>(() => [
  {
    title: 'Training',
    items: [
      { label: 'Dashboard', to: '/student', icon: LayoutDashboard },
      {
        label: 'Weekly logbook',
        to: '/student/logbook',
        icon: NotebookPen,
        badge: logbook.pendingEntries || null
      },
      { label: 'Submissions', to: '/student/submissions', icon: CalendarDays },
      { label: 'Feedback', to: '/student/feedback', icon: MessageSquareQuote }
    ]
  },
  {
    title: 'Placement',
    items: [
      { label: 'Placement details', to: '/student/placement', icon: Building2 },
      { label: 'Clearance', to: '/student/clearance', icon: FileText }
    ]
  },
  {
    title: 'Account',
    items: [{ label: 'Profile settings', to: '/student/profile', icon: UserCog }]
  }
])

const pageTitle = computed(() => route.meta.title ?? 'Student portal')

const breadcrumbs = computed<Breadcrumb[]>(() => [
  { label: 'Student', to: '/student' },
  ...(route.meta.breadcrumbs ?? [])
])

const weekProgress = computed(() => (logbook.activeWeekNo / logbook.totalWeeks) * 100)

onMounted(() => {
  logbook.loadInitialData()
  session.fetchUser()
})

const signOut = async () => {
  await session.logout()
}
</script>
