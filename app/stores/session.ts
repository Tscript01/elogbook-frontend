import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { mockStudent, mockStudentProfile } from '~/data/mock-student'
import { createApiService, type RegisterPayload } from '~/services/api'
import type { Role, StudentProfile } from '~/types/models'
import type { SessionUser } from '~/types/ui'
import {
  checkIsAuthenticated,
  clearDirectAuth,
  getDirectToken,
  getDirectUser,
  saveDirectAuth
} from '~/utils/auth'

export const useSessionStore = defineStore('session', () => {
  const api = useApi()
  const apiService = createApiService()
  const toast = useToast()

  const directUser = getDirectUser()
  const user = ref<SessionUser>(
    directUser || {
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      role: mockStudent.role,
      avatar_url: mockStudentProfile.avatar_url
    }
  )

  const profile = ref<StudentProfile>({ ...mockStudentProfile })
  const token = ref<string | null>(getDirectToken() || api.token.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => checkIsAuthenticated())

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
    return labels[user.value.role] ?? 'Student'
  })

  const setUser = (next: SessionUser) => {
    user.value = next
  }

  const setProfile = (next: StudentProfile) => {
    profile.value = next
  }

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiService.auth.login(credentials)
      if (res.token) {
        token.value = res.token
        api.setAuthToken(res.token)
      }
      if (res.user) {
        user.value = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          avatar_url: res.profile?.avatar_url || null
        }
      }
      if (res.profile) {
        profile.value = res.profile
      }
      toast.success('Signed in successfully', `Welcome back, ${user.value.name}`)
      await navigateTo('/student')
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      error.value = errorMessage
      toast.error('Authentication error', errorMessage || 'Invalid email or password')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiService.auth.register(payload)
      if (res.token) {
        token.value = res.token
        api.setAuthToken(res.token)
      }
      if (res.user) {
        user.value = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          avatar_url: res.profile?.avatar_url || null
        }
      }
      if (res.profile) {
        profile.value = res.profile
      }
      toast.success('Registration successful', 'Your student account has been created.')
      await navigateTo('/student')
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      error.value = errorMessage
      toast.error('Registration failed', errorMessage || 'Could not complete registration')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    isLoading.value = true
    try {
      const res = await apiService.auth.getMe()
      if (res.user) {
        user.value = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          avatar_url: res.profile?.avatar_url || null
        }
      }
      if (res.profile) {
        profile.value = res.profile
      }
    } catch (err: unknown) {
      // If token expired or invalid, log out quietly
      const msg = err instanceof Error ? err.message : 'Session check failed'
      console.warn('Session check failed:', msg)
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: Partial<StudentProfile> & { name?: string; email?: string }) => {
    isLoading.value = true
    error.value = null
    try {
      // First update local name/email
      if (data.name || data.email) {
        user.value = {
          ...user.value,
          name: data.name ?? user.value.name,
          email: data.email ?? user.value.email
        }
      }

      // Try sending to API
      try {
        const updated = await apiService.student.updateProfile(data)
        if (updated) {
          profile.value = { ...profile.value, ...updated }
        }
        toast.success('Profile saved', 'Your profile details were updated on the server.')
      } catch {
        // If API is not live, preserve local changes and notify
        profile.value = { ...profile.value, ...data }
        toast.info('Saved locally', 'Updated profile locally (API offline or endpoint not yet configured).')
      }
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed'
      error.value = errorMessage
      toast.error('Update failed', errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    token.value = null
    api.setAuthToken(null)
    clearDirectAuth()
    toast.info('Signed out', 'You have been logged out.')
    await navigateTo('/login')
  }

  const loadDemoUser = () => {
    const demoUser: SessionUser = {
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      role: mockStudent.role,
      avatar_url: mockStudentProfile.avatar_url
    }
    user.value = demoUser
    profile.value = { ...mockStudentProfile }
    token.value = 'demo-jwt-token'
    saveDirectAuth('demo-jwt-token', demoUser, mockStudentProfile)
    toast.info('Demo Session Loaded', 'Loaded student credentials in offline/demo mode.')
  }

  return {
    user,
    profile,
    token,
    isAuthenticated,
    initials,
    roleLabel,
    isLoading,
    error,
    setUser,
    setProfile,
    login,
    register,
    fetchUser,
    updateProfile,
    logout,
    loadDemoUser
  }
})
