<script setup>
import { ref, onMounted } from 'vue'
import { useConnectionStore } from '@/stores/useConnectionStore'
import FriendCard from '@/components/connections/FriendCard.vue'
import FriendRequestCard from '@/components/connections/FriendRequestCard.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const connectionStore = useConnectionStore()

const activeTab = ref('friends')
const confirmRemoveId = ref(null)

onMounted(() => {
  connectionStore.fetchFriends()
  connectionStore.fetchFriendRequests()
})

function handleRemoveFriend(friendId) {
  confirmRemoveId.value = friendId
}

async function confirmRemove() {
  await connectionStore.removeFriend(confirmRemoveId.value)
  confirmRemoveId.value = null
}

async function handleBlock(userId) {
  await connectionStore.blockUser(userId)
  connectionStore.fetchFriends()
}
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Friends</h1>

    <div class="flex gap-4 mb-4 border-b border-gray-300">
      <button
        class="pb-2 text-sm font-medium cursor-pointer"
        :class="activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'"
        @click="activeTab = 'friends'"
      >
        My Friends ({{ connectionStore.friends.length }})
      </button>
      <button
        class="pb-2 text-sm font-medium cursor-pointer"
        :class="activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'"
        @click="activeTab = 'requests'"
      >
        Requests ({{ connectionStore.friendRequests.length }})
      </button>
    </div>

    <BaseAlert
      v-if="connectionStore.error"
      type="error"
      :message="connectionStore.error"
      class="mb-4"
    />

    <div v-if="connectionStore.loading" class="text-sm text-gray-500">Loading...</div>

    <template v-else-if="activeTab === 'friends'">
      <div class="space-y-3">
        <FriendCard
          v-for="friend in connectionStore.friends"
          :key="friend.id"
          :friend="friend"
          @remove="handleRemoveFriend"
          @block="handleBlock"
        />
        <p v-if="connectionStore.friends.length === 0" class="text-sm text-gray-500">
          No friends yet. Check out suggestions!
        </p>
      </div>
    </template>

    <template v-else>
      <div class="space-y-3">
        <FriendRequestCard
          v-for="request in connectionStore.friendRequests"
          :key="request.id"
          :request="request"
          type="received"
          @accept="connectionStore.acceptFriendRequest"
          @reject="connectionStore.rejectFriendRequest"
        />
        <p v-if="connectionStore.friendRequests.length === 0" class="text-sm text-gray-500">
          No pending friend requests.
        </p>
      </div>
    </template>

    <ConfirmDialog
      v-if="confirmRemoveId"
      title="Remove Friend"
      message="Are you sure you want to remove this friend?"
      confirm-text="Remove"
      @confirm="confirmRemove"
      @cancel="confirmRemoveId = null"
    />
  </div>
</template>
