<template>
  <form class="paper-sheet" novalidate @submit.prevent="submit">
    <header
      class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-parchment-50 px-4 py-3 sm:px-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <p class="font-serif text-base font-semibold text-slate-900 dark:text-slate-100">
          {{ formatLongDate(date) }}
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Week {{ weekNo }} entry
          <span v-if="savedAt"> - last saved {{ savedAt }}</span>
        </p>
      </div>
      <UiBaseBadge :tone="locked ? 'info' : 'neutral'" dot>
        {{ locked ? 'Locked for review' : 'Editable draft' }}
      </UiBaseBadge>
    </header>

    <div class="space-y-5 p-4 sm:p-5">
      <div>
        <label :for="descriptionId" class="field-label">Description of work done</label>
        <textarea
          :id="descriptionId"
          v-model="description"
          rows="8"
          class="field-control font-serif leading-relaxed"
          :class="hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40' : ''"
          :disabled="locked"
          :aria-invalid="hasError"
          :aria-describedby="`${descriptionId}-hint`"
          placeholder="Describe the tasks you carried out, the tools you used and what you learned."
        />
        <p :id="`${descriptionId}-hint`" class="field-hint">
          Minimum 10 characters. {{ description.trim().length }} characters written.
        </p>
        <p v-if="hasError" class="mt-1 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          Please describe the work you carried out before saving.
        </p>
      </div>

      <StudentMediaUploader v-model="imageUrl" :disabled="locked" />
    </div>

    <footer
      class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:px-5 dark:border-slate-800"
    >
      <UiBaseButton
        v-if="hasExisting"
        variant="ghost"
        size="sm"
        :disabled="locked"
        @click="emit('delete', date)"
      >
        <Trash2 class="h-4 w-4" aria-hidden="true" />
        Clear entry
      </UiBaseButton>
      <span v-else />

      <div class="flex items-center gap-2">
        <UiBaseButton variant="outline" size="md" :disabled="locked" @click="reset">
          Reset
        </UiBaseButton>
        <UiBaseButton type="submit" size="md" :disabled="locked">
          <Save class="h-4 w-4" aria-hidden="true" />
          Save entry
        </UiBaseButton>
      </div>
    </footer>
  </form>
</template>

<script setup lang="ts">
import { Save, Trash2 } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import type { DailyLog } from '~/types/models'
import { formatLongDate } from '~/utils/date'

const props = withDefaults(
  defineProps<{
    date: string
    weekNo: number
    log?: DailyLog | null
    locked?: boolean
  }>(),
  { log: null, locked: false }
)

const emit = defineEmits<{
  save: [payload: { date: string; description: string; image_url: string | null }]
  delete: [date: string]
}>()

const descriptionId = 'daily-log-description'
const description = ref(props.log?.description ?? '')
const imageUrl = ref<string | null>(props.log?.image_url ?? null)
const hasError = ref(false)
const savedAt = ref('')

const hasExisting = computed(() => Boolean(props.log))

watch(
  () => props.date,
  () => {
    description.value = props.log?.description ?? ''
    imageUrl.value = props.log?.image_url ?? null
    hasError.value = false
    savedAt.value = ''
  }
)

watch(
  () => props.log,
  (log) => {
    description.value = log?.description ?? ''
    imageUrl.value = log?.image_url ?? null
  }
)

const reset = () => {
  description.value = props.log?.description ?? ''
  imageUrl.value = props.log?.image_url ?? null
  hasError.value = false
}

const submit = () => {
  if (description.value.trim().length < 10) {
    hasError.value = true
    return
  }
  hasError.value = false
  emit('save', {
    date: props.date,
    description: description.value.trim(),
    image_url: imageUrl.value
  })
  savedAt.value = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
</script>
