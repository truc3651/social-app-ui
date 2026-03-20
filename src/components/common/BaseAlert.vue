<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'error', 'warning'].includes(v),
  },
  message: {
    type: String,
    required: true,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['dismiss'])
</script>

<template>
  <div
    class="px-4 py-3 rounded border text-sm flex items-center justify-between"
    :class="{
      'bg-blue-50 border-blue-200 text-blue-800': type === 'info',
      'bg-green-50 border-green-200 text-green-800': type === 'success',
      'bg-red-50 border-red-200 text-red-800': type === 'error',
      'bg-yellow-50 border-yellow-200 text-yellow-800': type === 'warning',
    }"
  >
    <span>{{ message }}</span>
    <button
      v-if="dismissible"
      class="ml-4 text-current opacity-60 hover:opacity-100 cursor-pointer"
      @click="$emit('dismiss')"
    >
      &times;
    </button>
  </div>
</template>
