<script setup>
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  confirmVariant: {
    type: String,
    default: 'danger',
  },
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <BaseModal :title="title" @close="$emit('cancel')">
    <p class="text-sm text-gray-600 mb-4">{{ message }}</p>
    <div class="flex justify-end gap-2">
      <BaseButton variant="secondary" @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton :variant="confirmVariant" @click="$emit('confirm')">{{ confirmText }}</BaseButton>
    </div>
  </BaseModal>
</template>
