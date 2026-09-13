<template>
  <div>
    <span id="media-uploader-label" class="field-label">Attached diagram or photograph</span>

    <div
      v-if="!modelValue"
      class="rounded-xl border-2 border-dashed px-4 py-6 text-center transition"
      :class="
        dragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
          : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60'
      "
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <div v-if="uploading" class="py-4">
        <svg
          class="mx-auto h-7 w-7 animate-spin text-primary-600 dark:text-primary-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p class="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          Uploading diagram to server...
        </p>
      </div>

      <template v-else>
        <ImagePlus class="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Drag a diagram here or
          <label
            :for="inputId"
            class="cursor-pointer font-medium text-primary-600 underline underline-offset-2 dark:text-primary-400"
          >
            browse your files
          </label>
        </p>
        <p class="field-hint">PNG, JPG or WEBP up to 5 MB. One attachment per daily entry.</p>
      </template>
      <input
        :id="inputId"
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="sr-only"
        :disabled="disabled"
        aria-labelledby="media-uploader-label"
        @change="onSelect"
      >
      <p v-if="error" class="mt-2 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
        {{ error }}
      </p>
    </div>

    <figure
      v-else
      class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <img :src="modelValue" :alt="alt" class="h-44 w-full object-cover" >
      <figcaption
        class="flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2 dark:border-slate-800"
      >
        <span class="flex items-center gap-2 truncate text-xs text-slate-500 dark:text-slate-400">
          <Paperclip class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span class="truncate">{{ fileName || 'Attached diagram' }}</span>
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
          :disabled="disabled"
          @click="remove"
        >
          <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
          Remove
        </button>
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { ImagePlus, Paperclip, Trash2 } from '@lucide/vue'
import { ref } from 'vue'
import { useLogbookStore } from '~/stores/logbook'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    alt?: string
    disabled?: boolean
  }>(),
  { alt: 'Attached logbook diagram', disabled: false }
)

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const logbook = useLogbookStore()
const inputId = 'daily-log-media'
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const uploading = ref(false)
const fileName = ref('')
const error = ref('')

const MAX_SIZE = 5 * 1024 * 1024

const accept = async (file: File | undefined) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = 'Only image files can be attached.'
    return
  }
  if (file.size > MAX_SIZE) {
    error.value = 'That file is larger than the 5 MB limit.'
    return
  }
  error.value = ''
  fileName.value = file.name
  uploading.value = true

  try {
    const url = await logbook.uploadMedia(file)
    emit('update:modelValue', url)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Image upload failed.'
  } finally {
    uploading.value = false
  }
}

const onSelect = (event: Event) => {
  accept((event.target as HTMLInputElement).files?.[0])
}

const onDrop = (event: DragEvent) => {
  dragging.value = false
  if (props.disabled) return
  accept(event.dataTransfer?.files?.[0])
}

const remove = () => {
  fileName.value = ''
  error.value = ''
  if (fileInput.value) fileInput.value.value = ''
  emit('update:modelValue', null)
}
</script>
