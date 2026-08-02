import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Role } from '~/types/models'
import type { SessionUser } from '~/types/ui'
import { mockStudent, mockStudentProfile } from '~/data/mock-student'

export const useSessionStore = defineStore('session', () => {
  const user = ref<SessionUser>({
    id: mockStudent.id,
    name: mockStudent.name,
    email: mockStudent.email,
    role: mockStudent.role,
    avatar_url: mockStudentProfile.avatar_url
  })

  const initials = computed(() =>
    user.value.name
      .split(' ')
      .filter((part) => /[a-zA-Z]/.test(part.charAt(0)))
      .slice(-2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
  )

  const roleLabel = computed<string>(() => {
    const labels: Record<Role, string> = {
      STUDENT: 'Student',
      IND_SUPERVISOR: 'Industry Supervisor',
      INST_COORDINATOR: 'Institution Coordinator',
      ITF_OFFICIAL: 'ITF Official',
      ADMIN: 'Administrator'
    }
    return labels[user.value.role]
  })

  const setUser = (next: SessionUser) => {
    user.value = next
  }

  return { user, initials, roleLabel, setUser }
})
