import { ref } from 'vue'
import { defineStore } from 'pinia'
import postService from '@/services/postService'

export const usePostStore = defineStore('post', () => {
  const feedPosts = ref([])
  const userPosts = ref([])
  const taggedPosts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const hasMoreFeed = ref(true)
  const feedPage = ref(0)

  function clearError() {
    error.value = null
  }

  function resetFeed() {
    feedPosts.value = []
    feedPage.value = 0
    hasMoreFeed.value = true
  }

  async function fetchFeed() {
    if (!hasMoreFeed.value) return
    loading.value = true
    error.value = null
    try {
      const { data } = await postService.getFeed({ page: feedPage.value, size: 10 })
      if (data.content.length < 10) {
        hasMoreFeed.value = false
      }
      feedPosts.value.push(...data.content)
      feedPage.value++
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load feed'
    } finally {
      loading.value = false
    }
  }

  async function fetchUserPosts(userId) {
    loading.value = true
    error.value = null
    try {
      const { data } = await postService.getUserPosts(userId)
      userPosts.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load posts'
    } finally {
      loading.value = false
    }
  }

  async function fetchTaggedPosts(userId) {
    loading.value = true
    error.value = null
    try {
      const { data } = await postService.getTaggedPosts(userId)
      taggedPosts.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load tagged posts'
    } finally {
      loading.value = false
    }
  }

  async function fetchPostById(postId) {
    loading.value = true
    error.value = null
    try {
      const { data } = await postService.getPostById(postId)
      currentPost.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load post'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPost(postData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await postService.createPost(postData)
      feedPosts.value.unshift(data)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create post'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePost(postId, postData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await postService.updatePost(postId, postData)
      const feedIndex = feedPosts.value.findIndex((p) => p.id === postId)
      if (feedIndex !== -1) feedPosts.value[feedIndex] = data
      const userIndex = userPosts.value.findIndex((p) => p.id === postId)
      if (userIndex !== -1) userPosts.value[userIndex] = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update post'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePost(postId) {
    try {
      await postService.deletePost(postId)
      feedPosts.value = feedPosts.value.filter((p) => p.id !== postId)
      userPosts.value = userPosts.value.filter((p) => p.id !== postId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete post'
      throw err
    }
  }

  return {
    feedPosts,
    userPosts,
    taggedPosts,
    currentPost,
    loading,
    error,
    hasMoreFeed,
    clearError,
    resetFeed,
    fetchFeed,
    fetchUserPosts,
    fetchTaggedPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  }
})
