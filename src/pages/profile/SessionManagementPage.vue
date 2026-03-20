<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formatDateTime } from '@/utils/formatDate'

const authStore = useAuthStore()
const showRevokeAllDialog = ref(false)

onMounted(() => {
  authStore.fetchSessions()
})

async function revokeAll() {
  await authStore.revokeAllOtherSessions()
  showRevokeAllDialog.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">Active Sessions</h1>
      <BaseButton
        variant="danger"
        size="sm"
        @click="showRevokeAllDialog = true"
      >
        Revoke All Others
      </BaseButton>
    </div>

    <BaseAlert
      v-if="authStore.error"
      type="error"
      :message="authStore.error"
      class="mb-4"
    />

    <div v-if="authStore.loading" class="text-sm text-gray-500">Loading sessions...</div>

    <div v-else class="space-y-3">
      <div
        v-for="session in authStore.sessions"
        :key="session.id"
        class="bg-white border border-gray-300 rounded p-4 flex items-center justify-between"
      >
        <div>
          <p class="text-sm font-medium text-gray-800">
            {{ session.deviceInfo || 'Unknown Device' }}
            <span v-if="session.current" class="text-xs text-green-600 ml-2">(Current)</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Last active: {{ formatDateTime(session.lastActiveAt) }}
          </p>
          <p class="text-xs text-gray-400">
            IP: {{ session.ipAddress || 'N/A' }}
          </p>
        </div>
        <BaseButton
          v-if="!session.current"
          variant="danger"
          size="sm"
          @click="authStore.revokeSession(session.id)"
        >
          Revoke
        </BaseButton>
      </div>

      <p
        v-if="authStore.sessions.length === 0"
        class="text-sm text-gray-500"
      >
        No active sessions found.
      </p>
    </div>

    <ConfirmDialog
      v-if="showRevokeAllDialog"
      title="Revoke All Sessions"
      message="This will log you out from all other devices. Continue?"
      confirm-text="Revoke All"
      @confirm="revokeAll"
      @cancel="showRevokeAllDialog = false"
    />
  </div>
</template>
