<script setup>
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

defineProps({
  request: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: 'received',
    validator: (v) => ['received', 'sent'].includes(v),
  },
})

defineEmits(['accept', 'reject', 'cancel'])
</script>

<template>
  <div class="bg-white border border-gray-300 rounded p-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <UserAvatar
        :src="request.user?.avatarUrl"
        :name="request.user?.fullName"
      />
      <div>
        <p class="text-sm font-medium text-gray-800">{{ request.user?.fullName }}</p>
        <p class="text-xs text-gray-500">{{ request.user?.email }}</p>
      </div>
    </div>

    <div class="flex gap-2">
      <template v-if="type === 'received'">
        <BaseButton size="sm" @click="$emit('accept', request.id)">Accept</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="$emit('reject', request.id)">Reject</BaseButton>
      </template>
      <template v-else>
        <BaseButton variant="secondary" size="sm" @click="$emit('cancel', request.id)">Cancel</BaseButton>
      </template>
    </div>
  </div>
</template>
