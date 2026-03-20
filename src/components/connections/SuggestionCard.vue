<script setup>
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

defineProps({
  user: {
    type: Object,
    required: true,
  },
})

defineEmits(['add-friend', 'follow'])

const router = useRouter()

function viewProfile(userId) {
  router.push({ name: 'profile', params: { userId } })
}
</script>

<template>
  <div class="bg-white border border-gray-300 rounded p-4 flex items-center justify-between">
    <div
      class="flex items-center gap-3 cursor-pointer"
      @click="viewProfile(user.id)"
    >
      <UserAvatar
        :src="user.avatarUrl"
        :name="user.fullName"
      />
      <div>
        <p class="text-sm font-medium text-gray-800">{{ user.fullName }}</p>
        <p class="text-xs text-gray-500">
          {{ user.mutualFriendsCount || 0 }} mutual friends
        </p>
      </div>
    </div>

    <div class="flex gap-2">
      <BaseButton size="sm" @click="$emit('add-friend', user.id)">Add Friend</BaseButton>
      <BaseButton variant="secondary" size="sm" @click="$emit('follow', user.id)">Follow</BaseButton>
    </div>
  </div>
</template>
