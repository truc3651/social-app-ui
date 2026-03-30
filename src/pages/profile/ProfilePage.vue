<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePostStore } from '@/stores/usePostStore'
import { useConnectionStore } from '@/stores/useConnectionStore'
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import PostCard from '@/components/posts/PostCard.vue'

const route = useRoute()
const authStore = useAuthStore()
const postStore = usePostStore()
const connectionStore = useConnectionStore()

const profileUserId = computed(() => route.params.userId || authStore.userId)
const isOwnProfile = computed(() => String(profileUserId.value) === String(authStore.userId))

const showEditModal = ref(false)
const editFullName = ref('')

onMounted(() => {
  loadProfile()
})

watch(() => route.params.userId, loadProfile)

function loadProfile() {
  postStore.fetchUserPosts(profileUserId.value)
}

function openEditModal() {
  editFullName.value = authStore.fullName
  showEditModal.value = true
}

async function saveProfile() {
  await authStore.updateProfile({ fullName: editFullName.value })
  showEditModal.value = false
}

async function handlePictureUrlSubmit(url) {
  await authStore.updateProfile({ profilePictureUrl: url })
}
</script>

<template>
  <div>
    <div class="bg-white border border-gray-300 rounded p-6 mb-6">
      <div class="flex items-start gap-4">
        <UserAvatar
          :src="authStore.user?.avatarUrl"
          :name="authStore.fullName"
          size="lg"
          :allow-picture-url-edit="isOwnProfile"
          @picture-url-submit="handlePictureUrlSubmit"
        />

        <div class="flex-1">
          <h1 class="text-xl font-bold text-gray-800">
            {{ authStore.fullName }}
          </h1>
          <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
        </div>

        <div v-if="isOwnProfile">
          <BaseButton variant="secondary" size="sm" @click="openEditModal">
            Edit Profile
          </BaseButton>
        </div>

        <div v-else class="flex gap-2">
          <BaseButton size="sm" @click="connectionStore.sendFriendRequest(profileUserId)">
            Add Friend
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="connectionStore.followUser(profileUserId)">
            Follow
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="connectionStore.blockUser(profileUserId)">
            Block
          </BaseButton>
        </div>
      </div>
    </div>

    <h2 class="text-lg font-semibold text-gray-800 mb-3">
      {{ isOwnProfile ? 'My Posts' : 'Posts' }}
    </h2>

    <BaseAlert
      v-if="postStore.error"
      type="error"
      :message="postStore.error"
      class="mb-4"
    />

    <div v-if="postStore.loading" class="text-sm text-gray-500">Loading posts...</div>

    <div v-else class="space-y-4">
      <PostCard
        v-for="post in postStore.userPosts"
        :key="post.id"
        :post="post"
      />
      <p v-if="postStore.userPosts.length === 0" class="text-sm text-gray-500">
        No posts yet.
      </p>
    </div>

    <BaseModal v-if="showEditModal" title="Edit Profile" @close="showEditModal = false">
      <form @submit.prevent="saveProfile">
        <BaseInput v-model="editFullName" label="Full Name" />
        <div class="flex justify-end gap-2 mt-4">
          <BaseButton variant="secondary" @click="showEditModal = false">Cancel</BaseButton>
          <BaseButton type="submit" :loading="authStore.loading">Save</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
