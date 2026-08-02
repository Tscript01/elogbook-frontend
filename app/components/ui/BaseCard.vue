<template>
  <section class="paper-sheet">
    <header
      v-if="title || $slots.actions"
      class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 dark:border-slate-800"
    >
      <div>
        <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
        <p v-if="description" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {{ description }}
        </p>
      </div>
      <slot name="actions" />
    </header>
    <div :class="padded ? 'p-4 sm:p-5' : ''">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    padded?: boolean
  }>(),
  { title: '', description: '', padded: true }
)
</script>
