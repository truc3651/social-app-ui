<script setup>
import { onMounted } from 'vue'
import { usePostStore } from '@/stores/usePostStore'
import { useAuthStore } from '@/stores/useAuthStore'
import PostCard from '@/components/posts/PostCard.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const postStore = usePostStore()
const authStore = useAuthStore()

onMounted(() => {
  postStore.fetchTaggedPosts(authStore.userId)
})
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Posts You're Tagged In</h1>

    <BaseAlert
      v-if="postStore.error"
      type="error"
      :message="postStore.error"
      class="mb-4"
    />

    <div v-if="postStore.loading" class="text-sm text-gray-500">Loading tagged posts...</div>

    <div v-else class="space-y-4">
      <PostCard
        v-for="post in postStore.taggedPosts"
        :key="post.id"
        :post="post"
      />
      <p v-if="postStore.taggedPosts.length === 0" class="text-sm text-gray-500">
        You haven't been tagged in any posts yet.
      </p>
    </div>
  </div>
</template>
