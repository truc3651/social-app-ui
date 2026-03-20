<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-medium border rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      {
        'bg-blue-600 text-white border-blue-600 hover:bg-blue-700': variant === 'primary',
        'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': variant === 'secondary',
        'bg-red-600 text-white border-red-600 hover:bg-red-700': variant === 'danger',
        'bg-transparent text-gray-600 border-transparent hover:bg-gray-100': variant === 'ghost',
      },
      {
        'px-2 py-1 text-xs': size === 'sm',
        'px-4 py-2 text-sm': size === 'md',
        'px-6 py-2.5 text-base': size === 'lg',
      },
    ]"
  >
    <span v-if="loading" class="mr-2">...</span>
    <slot />
  </button>
</template>
