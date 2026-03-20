<script setup>
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

defineProps({
  friend: {
    type: Object,
    required: true,
  },
})

defineEmits(['remove', 'block'])

const router = useRouter()

function viewProfile(userId) {
  router.push({ name: 'profile', params: { userId } })
}
</script>

<template>
  <div class="bg-white border border-gray-300 rounded p-4 flex items-center justify-between">
    <div
      class="flex items-center gap-3 cursor-pointer"
      @click="viewProfile(friend.id)"
    >
      <UserAvatar
        :src="friend.avatarUrl"
        :name="friend.fullName"
      />
      <div>
        <p class="text-sm font-medium text-gray-800">{{ friend.fullName }}</p>
        <p class="text-xs text-gray-500">{{ friend.email }}</p>
      </div>
    </div>

    <div class="flex gap-2">
      <BaseButton variant="secondary" size="sm" @click="$emit('remove', friend.id)">
        Unfriend
      </BaseButton>
      <BaseButton variant="danger" size="sm" @click="$emit('block', friend.id)">
        Block
      </BaseButton>
    </div>
  </div>
</template>
