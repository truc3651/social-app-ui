<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  /** When true, show a field to paste or type a profile image URL (no file upload). */
  allowPictureUrlEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['picture-url-submit'])

const pictureUrlInput = ref('')

watch(
  () => props.src,
  (v) => {
    pictureUrlInput.value = v || ''
  },
  { immediate: true },
)

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  }
  return sizes[props.size]
})

function submitPictureUrl() {
  const url = pictureUrlInput.value.trim()
  if (!url) return
  emit('picture-url-submit', url)
}

function onPastePictureUrl(event) {
  const text = event.clipboardData?.getData('text')?.trim()
  if (!text) return
  pictureUrlInput.value = text
  emit('picture-url-submit', text)
}
</script>

<template>
  <div class="flex flex-col gap-2 items-start">
    <div
      class="rounded-full overflow-hidden flex items-center justify-center bg-gray-300 text-gray-600 font-medium shrink-0"
      :class="sizeClasses"
    >
      <img
        v-if="src"
        :src="src"
        :alt="name"
        class="w-full h-full object-cover"
      />
      <span v-else>{{ initials }}</span>
    </div>

    <div
      v-if="allowPictureUrlEdit"
      class="w-full max-w-xs space-y-1"
    >
      <label class="block text-xs text-gray-500">Profile image URL</label>
      <input
        v-model="pictureUrlInput"
        type="url"
        autocomplete="off"
        placeholder="Paste or type image link"
        class="w-full text-xs border border-gray-300 rounded px-2 py-1 text-gray-800"
        @paste="onPastePictureUrl"
        @keydown.enter.prevent="submitPictureUrl"
      />
      <button
        type="button"
        class="text-xs text-blue-600 hover:underline"
        @click="submitPictureUrl"
      >
        Apply URL
      </button>
    </div>
  </div>
</template>
