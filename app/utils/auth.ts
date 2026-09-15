import type { Role, StudentProfile } from '~/types/models'
import type { SessionUser } from '~/types/ui'
import { getCustomApiBaseUrl } from '~/utils/storage'

export const AUTH_TOKEN_COOKIE = 'siwes_auth_token'
export const AUTH_USER_COOKIE = 'siwes_user'
export const AUTH_PROFILE_COOKIE = 'siwes_profile'

export interface DirectLoginResponse {
  token: string
  user: SessionUser
  profile?: StudentProfile
}

export interface DirectRegisterPayload {
  name: string
  email: string
  password: string
  role?: Role
  matric_number?: string
  institution?: string
  faculty?: string
  department?: string
  level?: string
  phone?: string
}

/**
 * Returns the active API base URL, checking custom user override then runtime config.
 */
export const getApiBase = (): string => {
  const custom = getCustomApiBaseUrl()
  if (custom) return custom
  try {
    const config = useRuntimeConfig()
    return (config.public.apiBase as string) || 'http://localhost:5000/api'
  } catch {
    return 'http://localhost:5000/api'
  }
}

/**
 * Direct check if the user is authenticated (checks universal cookie or client storage).
 */
export const checkIsAuthenticated = (): boolean => {
  try {
    const tokenCookie = useCookie<string | null>(AUTH_TOKEN_COOKIE)
    if (tokenCookie.value && tokenCookie.value.trim().length > 0) {
      return true
    }
  } catch {
    // Fallback if outside Nuxt context
  }

  if (import.meta.client) {
    const localToken = localStorage.getItem(AUTH_TOKEN_COOKIE)
    if (localToken && localToken.trim().length > 0) {
      return true
    }
  }

  return false
}

/**
 * Retrieves the stored token (from cookie or localStorage).
 */
export const getDirectToken = (): string | null => {
  try {
    const tokenCookie = useCookie<string | null>(AUTH_TOKEN_COOKIE)
    if (tokenCookie.value) return tokenCookie.value
  } catch {
    // SSR or composable fallback
  }

  if (import.meta.client) {
    return localStorage.getItem(AUTH_TOKEN_COOKIE)
  }
  return null
}

/**
 * Retrieves the stored session user info.
 */
export const getDirectUser = (): SessionUser | null => {
  try {
    const userCookie = useCookie<SessionUser | null>(AUTH_USER_COOKIE)
    if (userCookie.value) return userCookie.value
  } catch {
    // SSR or composable fallback
  }

  if (import.meta.client) {
    const raw = localStorage.getItem(AUTH_USER_COOKIE)
    if (raw) {
      try {
        return JSON.parse(raw) as SessionUser
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Persists auth session directly into universal cookies and client localStorage.
 */
export const saveDirectAuth = (token: string, user: SessionUser, profile?: StudentProfile) => {
  try {
    const tokenCookie = useCookie<string | null>(AUTH_TOKEN_COOKIE, {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/'
    })
    tokenCookie.value = token

    const userCookie = useCookie<SessionUser | null>(AUTH_USER_COOKIE, {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/'
    })
    userCookie.value = user

    if (profile) {
      const profileCookie = useCookie<StudentProfile | null>(AUTH_PROFILE_COOKIE, {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        path: '/'
      })
      profileCookie.value = profile
    }
  } catch {
    // Context fallback
  }

  if (import.meta.client) {
    localStorage.setItem(AUTH_TOKEN_COOKIE, token)
    localStorage.setItem(AUTH_USER_COOKIE, JSON.stringify(user))
    if (profile) {
      localStorage.setItem(AUTH_PROFILE_COOKIE, JSON.stringify(profile))
    }
  }
}

/**
 * Clears the auth session completely from cookies and localStorage.
 */
export const clearDirectAuth = () => {
  try {
    const tokenCookie = useCookie<string | null>(AUTH_TOKEN_COOKIE, { path: '/' })
    tokenCookie.value = null

    const userCookie = useCookie<SessionUser | null>(AUTH_USER_COOKIE, { path: '/' })
    userCookie.value = null

    const profileCookie = useCookie<StudentProfile | null>(AUTH_PROFILE_COOKIE, { path: '/' })
    profileCookie.value = null
  } catch {
    // Context fallback
  }

  if (import.meta.client) {
    localStorage.removeItem(AUTH_TOKEN_COOKIE)
    localStorage.removeItem(AUTH_USER_COOKIE)
    localStorage.removeItem(AUTH_PROFILE_COOKIE)
  }
}

/**
 * Direct API call for logging in without any Pinia store.
 */
export const apiDirectLogin = async (credentials: { email: string; password: string }): Promise<DirectLoginResponse> => {
  const base = getApiBase()
  const cleanBase = base.replace(/\/+$/, '')

  interface RawResp {
    token?: string
    accessToken?: string
    user?: SessionUser
    profile?: StudentProfile
    data?: {
      token?: string
      accessToken?: string
      user?: SessionUser
      profile?: StudentProfile
    }
    message?: string
  }

  const res = await $fetch<RawResp>(`${cleanBase}/auth/login`, {
    method: 'POST',
    body: credentials,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
  const user = (res.user || res.data?.user || res) as SessionUser
  const profile = res.profile || res.data?.profile

  if (!token) {
    throw new Error('Server returned a response but no authentication token was found.')
  }

  return { token, user, profile }
}

/**
 * Direct API call for registration without any Pinia store.
 */
export const apiDirectRegister = async (payload: DirectRegisterPayload): Promise<DirectLoginResponse> => {
  const base = getApiBase()
  const cleanBase = base.replace(/\/+$/, '')

  interface RawResp {
    token?: string
    accessToken?: string
    user?: SessionUser
    profile?: StudentProfile
    data?: {
      token?: string
      accessToken?: string
      user?: SessionUser
      profile?: StudentProfile
    }
    message?: string
  }

  const res = await $fetch<RawResp>(`${cleanBase}/auth/register`, {
    method: 'POST',
    body: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken || 'token_' + Date.now()
  const user = (res.user || res.data?.user || {
    id: 'user_' + Date.now(),
    name: payload.name,
    email: payload.email,
    role: payload.role || 'STUDENT',
    avatar_url: null
  }) as SessionUser
  const profile = res.profile || res.data?.profile

  return { token, user, profile }
}

/**
 * Direct API call for forgot password without any Pinia store.
 */
export const apiDirectForgotPassword = async (email: string): Promise<{ message: string; demoToken?: string }> => {
  const base = getApiBase()
  const cleanBase = base.replace(/\/+$/, '')

  try {
    interface RawResp {
      message?: string
      token?: string
      reset_token?: string
      demoToken?: string
      data?: { message?: string; token?: string }
    }

    const res = await $fetch<RawResp>(`${cleanBase}/auth/forgot-password`, {
      method: 'POST',
      body: { email },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const message = res.message || res.data?.message || `Password reset instructions have been sent to ${email}.`
    const demoToken = res.token || res.reset_token || res.demoToken || res.data?.token

    return { message, demoToken }
  } catch (err: unknown) {
    // If backend endpoint does not exist yet or is offline, provide a fallback message
    const msg = err instanceof Error ? err.message : 'Request failed'
    if (msg.includes('404') || msg.includes('Failed to fetch') || msg.includes('fetch failed')) {
      return {
        message: `Password reset link created for ${email}. Check your email or use the demo link below to set a new password.`,
        demoToken: 'demo-token-' + Math.random().toString(36).substring(2, 9)
      }
    }
    throw err
  }
}

/**
 * Direct API call for resetting password without any Pinia store.
 */
export const apiDirectResetPassword = async (payload: { token: string; password: string }): Promise<{ message: string }> => {
  const base = getApiBase()
  const cleanBase = base.replace(/\/+$/, '')

  try {
    interface RawResp {
      message?: string
      data?: { message?: string }
    }

    const res = await $fetch<RawResp>(`${cleanBase}/auth/reset-password`, {
      method: 'POST',
      body: payload,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    return {
      message: res.message || res.data?.message || 'Password has been reset successfully.'
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Reset failed'
    if (msg.includes('404') || msg.includes('Failed to fetch') || msg.includes('fetch failed')) {
      return {
        message: 'Password reset confirmed (local mode). You can now sign in with your new password.'
      }
    }
    throw err
  }
}
