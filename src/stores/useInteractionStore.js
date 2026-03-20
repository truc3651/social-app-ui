import { ref } from 'vue'
import { defineStore } from 'pinia'
import interactionService from '@/services/interactionService'

export const useInteractionStore = defineStore('interaction', () => {
  const commentsByPost = ref({})
  const reactionsByPost = ref({})
  const loading = ref(false)
  const error = ref(null)

  function clearError() {
    error.value = null
  }

  async function fetchPostReactions(postId) {
    try {
      const { data } = await interactionService.getPostReactions(postId)
      reactionsByPost.value[postId] = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load reactions'
    }
  }

  async function reactToPost(postId, reactionType) {
    try {
      const { data } = await interactionService.reactToPost(postId, reactionType)
      await fetchPostReactions(postId)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to react'
      throw err
    }
  }

  async function removeReaction(postId) {
    try {
      await interactionService.removeReaction(postId)
      await fetchPostReactions(postId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove reaction'
      throw err
    }
  }

  async function fetchPostComments(postId) {
    loading.value = true
    try {
      const { data } = await interactionService.getPostComments(postId)
      commentsByPost.value[postId] = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load comments'
    } finally {
      loading.value = false
    }
  }

  async function createComment(postId, content, parentCommentId = null) {
    try {
      const { data } = await interactionService.createComment(postId, content, parentCommentId)
      await fetchPostComments(postId)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to post comment'
      throw err
    }
  }

  async function deleteComment(postId, commentId) {
    try {
      await interactionService.deleteComment(commentId)
      await fetchPostComments(postId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete comment'
      throw err
    }
  }

  async function likeComment(commentId) {
    try {
      await interactionService.likeComment(commentId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to like comment'
      throw err
    }
  }

  async function unlikeComment(commentId) {
    try {
      await interactionService.unlikeComment(commentId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to unlike comment'
      throw err
    }
  }

  return {
    commentsByPost,
    reactionsByPost,
    loading,
    error,
    clearError,
    fetchPostReactions,
    reactToPost,
    removeReaction,
    fetchPostComments,
    createComment,
    deleteComment,
    likeComment,
    unlikeComment,
  }
})
