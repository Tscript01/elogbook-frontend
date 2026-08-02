import type { Component } from 'vue'
import type { Role } from './models'

export interface NavItem {
  label: string
  to: string
  icon: Component
  badge?: number | null
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface Breadcrumb {
  label: string
  to?: string
}

export interface SessionUser {
  id: string
  name: string
  email: string
  role: Role
  avatar_url: string | null
}
