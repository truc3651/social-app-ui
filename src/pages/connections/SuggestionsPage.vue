<script setup>
import { onMounted } from 'vue'
import { useConnectionStore } from '@/stores/useConnectionStore'
import SuggestionCard from '@/components/connections/SuggestionCard.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const connectionStore = useConnectionStore()

onMounted(() => {
  connectionStore.fetchSuggestedFriends()
})

async function handleAddFriend(userId) {
  await connectionStore.sendFriendRequest(userId)
  connectionStore.suggestedFriends = connectionStore.suggestedFriends.filter(
    (u) => u.id !== userId
  )
}

async function handleFollow(userId) {
  await connectionStore.followUser(userId)
}
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Suggested Friends</h1>
    <p class="text-sm text-gray-500 mb-4">People you may know based on mutual friends.</p>

    <BaseAlert
      v-if="connectionStore.error"
      type="error"
      :message="connectionStore.error"
      class="mb-4"
    />

    <div v-if="connectionStore.loading" class="text-sm text-gray-500">Loading suggestions...</div>

    <div v-else class="space-y-3">
      <SuggestionCard
        v-for="user in connectionStore.suggestedFriends"
        :key="user.id"
        :user="user"
        @add-friend="handleAddFriend"
        @follow="handleFollow"
      />
      <p v-if="connectionStore.suggestedFriends.length === 0" class="text-sm text-gray-500">
        No suggestions available right now.
      </p>
    </div>
  </div>
</template>
