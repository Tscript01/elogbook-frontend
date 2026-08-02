import type { Breadcrumb } from './ui'

declare module '#app' {
  interface PageMeta {
    title?: string
    breadcrumbs?: Breadcrumb[]
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    breadcrumbs?: Breadcrumb[]
  }
}

export {}
