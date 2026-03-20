<script setup>
import { onMounted } from 'vue'
import { useConnectionStore } from '@/stores/useConnectionStore'
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const connectionStore = useConnectionStore()

onMounted(() => {
  connectionStore.fetchBlockedUsers()
})
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Blocked Users</h1>

    <BaseAlert
      v-if="connectionStore.error"
      type="error"
      :message="connectionStore.error"
      class="mb-4"
    />

    <div v-if="connectionStore.loading" class="text-sm text-gray-500">Loading...</div>

    <div v-else class="space-y-3">
      <div
        v-for="user in connectionStore.blockedUsers"
        :key="user.id"
        class="bg-white border border-gray-300 rounded p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <UserAvatar :src="user.avatarUrl" :name="user.fullName" />
          <div>
            <p class="text-sm font-medium text-gray-800">{{ user.fullName }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        <BaseButton
          variant="secondary"
          size="sm"
          @click="connectionStore.unblockUser(user.id)"
        >
          Unblock
        </BaseButton>
      </div>

      <p v-if="connectionStore.blockedUsers.length === 0" class="text-sm text-gray-500">
        You haven't blocked anyone.
      </p>
    </div>
  </div>
</template>
