<script setup>
import { onMounted } from 'vue'
import { usePostStore } from '@/stores/usePostStore'
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
import CreatePostForm from '@/components/posts/CreatePostForm.vue'
import PostCard from '@/components/posts/PostCard.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const postStore = usePostStore()
const loadMoreTrigger = ref(null)

onMounted(() => {
  postStore.resetFeed()
  postStore.fetchFeed()
})

useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !postStore.loading && postStore.hasMoreFeed) {
    postStore.fetchFeed()
  }
})
</script>

<template>
  <div>
    <CreatePostForm />

    <BaseAlert
      v-if="postStore.error"
      type="error"
      :message="postStore.error"
      class="mb-4"
    />

    <div class="space-y-4">
      <PostCard
        v-for="post in postStore.feedPosts"
        :key="post.id"
        :post="post"
      />
    </div>

    <div v-if="postStore.loading" class="text-center py-4 text-sm text-gray-500">
      Loading posts...
    </div>

    <div
      v-if="!postStore.hasMoreFeed && postStore.feedPosts.length > 0"
      class="text-center py-4 text-sm text-gray-400"
    >
      You've reached the end of the feed.
    </div>

    <p
      v-if="!postStore.loading && postStore.feedPosts.length === 0"
      class="text-center py-8 text-sm text-gray-500"
    >
      No posts yet. Follow some people or add friends to see their posts!
    </p>

    <div ref="loadMoreTrigger" class="h-4" />
  </div>
</template>
