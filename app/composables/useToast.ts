import { ref } from 'vue'

export type ToastTone = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  tone: ToastTone
  duration?: number
}

const toasts = ref<ToastMessage[]>([])

export const useToast = () => {
  const remove = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const add = (
    title: string,
    description?: string,
    tone: ToastTone = 'info',
    duration = 4000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const toastItem: ToastMessage = { id, title, description, tone, duration }
    toasts.value.push(toastItem)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    return id
  }

  const success = (title: string, description?: string, duration = 4000) =>
    add(title, description, 'success', duration)

  const error = (title: string, description?: string, duration = 6000) =>
    add(title, description, 'error', duration)

  const warning = (title: string, description?: string, duration = 5000) =>
    add(title, description, 'warning', duration)

  const info = (title: string, description?: string, duration = 4000) =>
    add(title, description, 'info', duration)

  return {
    toasts,
    add,
    remove,
    success,
    error,
    warning,
    info
  }
}
