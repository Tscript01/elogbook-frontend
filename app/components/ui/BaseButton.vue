<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="to ? undefined : disabled"
    :aria-disabled="disabled ? 'true' : undefined"
    class="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950"
    :class="[variantClasses[variant], sizeClasses[size], block ? 'w-full' : '']"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    to?: string
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', to: undefined, disabled: false, block: false }
)

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm'
}
</script>
