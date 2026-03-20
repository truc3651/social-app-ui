<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

function handleEscape(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />
    <div class="relative bg-white rounded border border-gray-300 shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
        <button
          class="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          @click="$emit('close')"
        >
          &times;
        </button>
      </div>
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
