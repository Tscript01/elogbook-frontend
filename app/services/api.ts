import { useApi } from '~/composables/useApi'
import type {
  DailyLog,
  FinalClearance,
  LogBookApproval,
  Placement,
  PlacementWithRelations,
  Role,
  StudentProfile,
  User,
  WeeklySubmission
} from '~/types/models'

export interface LoginResponse {
  token?: string
  accessToken?: string
  user: User
  profile?: StudentProfile
}

export interface RegisterPayload {
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

interface RawAuthResponse {
  token?: string
  accessToken?: string
  user?: User
  profile?: StudentProfile
  data?: {
    token?: string
    accessToken?: string
    user?: User
    profile?: StudentProfile
  }
}

interface GenericDataWrapper<T> {
  data?: T
  [key: string]: unknown
}

export const createApiService = () => {
  const api = useApi()

  return {
    auth: {
      login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
        const res = await api.request<RawAuthResponse>('/auth/login', {
          method: 'POST',
          body: credentials
        })

        const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
        const user = (res.user || res.data?.user || res) as unknown as User
        const profile = res.profile || res.data?.profile

        return { token, user, profile }
      },

      register: async (payload: RegisterPayload): Promise<LoginResponse> => {
        const res = await api.request<RawAuthResponse>('/auth/register', {
          method: 'POST',
          body: payload
        })

        const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
        const user = (res.user || res.data?.user || res) as unknown as User
        const profile = res.profile || res.data?.profile

        return { token, user, profile }
      },

      getMe: async (): Promise<{ user: User; profile?: StudentProfile }> => {
        const res = await api.request<RawAuthResponse>('/auth/me')
        const user = (res.user || res.data?.user || res) as unknown as User
        const profile = res.profile || res.data?.profile
        return { user, profile }
      }
    },

    student: {
      getProfile: async (): Promise<StudentProfile> => {
        const res = await api.request<GenericDataWrapper<StudentProfile> & { profile?: StudentProfile }>(
          '/student/profile'
        )
        return (res.data || res.profile || res) as unknown as StudentProfile
      },

      updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
        const res = await api.request<GenericDataWrapper<StudentProfile> & { profile?: StudentProfile }>(
          '/student/profile',
          {
            method: 'PUT',
            body: data
          }
        )
        return (res.data || res.profile || res) as unknown as StudentProfile
      }
    },

    placement: {
      getPlacement: async (): Promise<PlacementWithRelations> => {
        const res = await api.request<GenericDataWrapper<PlacementWithRelations> & { placement?: PlacementWithRelations }>(
          '/placements/current'
        )
        return (res.data || res.placement || res) as unknown as PlacementWithRelations
      },

      savePlacement: async (data: Partial<Placement>): Promise<Placement> => {
        const method = data.id ? 'PUT' : 'POST'
        const endpoint = data.id ? `/placements/${data.id}` : '/placements'
        const res = await api.request<GenericDataWrapper<Placement> & { placement?: Placement }>(
          endpoint,
          {
            method,
            body: data
          }
        )
        return (res.data || res.placement || res) as unknown as Placement
      }
    },

    logs: {
      getLogs: async (weekNo?: number): Promise<DailyLog[]> => {
        const res = await api.request<GenericDataWrapper<DailyLog[]> & { logs?: DailyLog[] }>(
          '/logs',
          {
            query: weekNo ? { week_no: weekNo } : undefined
          }
        )
        if (Array.isArray(res)) return res as DailyLog[]
        return (res.data || res.logs || []) as DailyLog[]
      },

      createLog: async (payload: {
        week_no: number
        log_date: string
        description: string
        image_url: string | null
      }): Promise<DailyLog> => {
        const res = await api.request<GenericDataWrapper<DailyLog> & { log?: DailyLog }>('/logs', {
          method: 'POST',
          body: payload
        })
        return (res.data || res.log || res) as unknown as DailyLog
      },

      updateLog: async (
        id: string,
        payload: {
          description: string
          image_url: string | null
        }
      ): Promise<DailyLog> => {
        const res = await api.request<GenericDataWrapper<DailyLog> & { log?: DailyLog }>(
          `/logs/${id}`,
          {
            method: 'PUT',
            body: payload
          }
        )
        return (res.data || res.log || res) as unknown as DailyLog
      },

      deleteLog: async (id: string): Promise<void> => {
        await api.request(`/logs/${id}`, {
          method: 'DELETE'
        })
      },

      uploadMedia: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('image', file)

        const res = await api.request<{
          url?: string
          imageUrl?: string
          file_url?: string
          data?: { url?: string }
        }>('/upload', {
          method: 'POST',
          body: formData
        })

        const url = res.url || res.imageUrl || res.file_url || res.data?.url
        if (!url) {
          throw new Error('Upload succeeded but no image URL was returned.')
        }
        return { url }
      }
    },

    submissions: {
      getSubmissions: async (): Promise<WeeklySubmission[]> => {
        const res = await api.request<GenericDataWrapper<WeeklySubmission[]> & { submissions?: WeeklySubmission[] }>(
          '/submissions'
        )
        if (Array.isArray(res)) return res as WeeklySubmission[]
        return (res.data || res.submissions || []) as WeeklySubmission[]
      },

      submitWeek: async (payload: {
        week_no: number
        submission_id?: string
      }): Promise<WeeklySubmission> => {
        const endpoint = payload.submission_id
          ? `/submissions/${payload.submission_id}/submit`
          : '/submissions/submit'
        const res = await api.request<GenericDataWrapper<WeeklySubmission> & { submission?: WeeklySubmission }>(
          endpoint,
          {
            method: 'POST',
            body: payload
          }
        )
        return (res.data || res.submission || res) as unknown as WeeklySubmission
      }
    },

    approvals: {
      getApprovals: async (): Promise<LogBookApproval[]> => {
        const res = await api.request<GenericDataWrapper<LogBookApproval[]> & { approvals?: LogBookApproval[] }>(
          '/approvals'
        )
        if (Array.isArray(res)) return res as LogBookApproval[]
        return (res.data || res.approvals || []) as LogBookApproval[]
      }
    },

    clearance: {
      getClearance: async (): Promise<FinalClearance> => {
        const res = await api.request<GenericDataWrapper<FinalClearance> & { clearance?: FinalClearance }>(
          '/clearance'
        )
        return (res.data || res.clearance || res) as unknown as FinalClearance
      },

      requestClearance: async (): Promise<FinalClearance> => {
        const res = await api.request<GenericDataWrapper<FinalClearance> & { clearance?: FinalClearance }>(
          '/clearance/request',
          {
            method: 'POST'
          }
        )
        return (res.data || res.clearance || res) as unknown as FinalClearance
      }
    }
  }
}
