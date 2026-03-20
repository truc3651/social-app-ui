import { ref } from 'vue'
import { defineStore } from 'pinia'
import connectionService from '@/services/connectionService'

export const useConnectionStore = defineStore('connection', () => {
  const friends = ref([])
  const friendRequests = ref([])
  const suggestedFriends = ref([])
  const following = ref([])
  const followers = ref([])
  const blockedUsers = ref([])
  const loading = ref(false)
  const error = ref(null)

  function clearError() {
    error.value = null
  }

  async function fetchFriends() {
    loading.value = true
    error.value = null
    try {
      const { data } = await connectionService.getFriends()
      friends.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load friends'
    } finally {
      loading.value = false
    }
  }

  async function fetchFriendRequests() {
    loading.value = true
    error.value = null
    try {
      const { data } = await connectionService.getFriendRequests()
      friendRequests.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load friend requests'
    } finally {
      loading.value = false
    }
  }

  async function sendFriendRequest(userId) {
    try {
      const { data } = await connectionService.sendFriendRequest(userId)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send friend request'
      throw err
    }
  }

  async function acceptFriendRequest(requestId) {
    try {
      await connectionService.acceptFriendRequest(requestId)
      friendRequests.value = friendRequests.value.filter((r) => r.id !== requestId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to accept request'
      throw err
    }
  }

  async function rejectFriendRequest(requestId) {
    try {
      await connectionService.rejectFriendRequest(requestId)
      friendRequests.value = friendRequests.value.filter((r) => r.id !== requestId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to reject request'
      throw err
    }
  }

  async function cancelFriendRequest(requestId) {
    try {
      await connectionService.cancelFriendRequest(requestId)
      friendRequests.value = friendRequests.value.filter((r) => r.id !== requestId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to cancel request'
      throw err
    }
  }

  async function removeFriend(friendId) {
    try {
      await connectionService.removeFriend(friendId)
      friends.value = friends.value.filter((f) => f.id !== friendId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove friend'
      throw err
    }
  }

  async function fetchSuggestedFriends() {
    loading.value = true
    try {
      const { data } = await connectionService.getSuggestedFriends()
      suggestedFriends.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load suggestions'
    } finally {
      loading.value = false
    }
  }

  async function followUser(userId) {
    try {
      await connectionService.followUser(userId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to follow user'
      throw err
    }
  }

  async function unfollowUser(userId) {
    try {
      await connectionService.unfollowUser(userId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to unfollow user'
      throw err
    }
  }

  async function fetchFollowing() {
    loading.value = true
    try {
      const { data } = await connectionService.getFollowing()
      following.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load following'
    } finally {
      loading.value = false
    }
  }

  async function fetchFollowers() {
    loading.value = true
    try {
      const { data } = await connectionService.getFollowers()
      followers.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load followers'
    } finally {
      loading.value = false
    }
  }

  async function blockUser(userId) {
    try {
      await connectionService.blockUser(userId)
      friends.value = friends.value.filter((f) => f.id !== userId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to block user'
      throw err
    }
  }

  async function unblockUser(userId) {
    try {
      await connectionService.unblockUser(userId)
      blockedUsers.value = blockedUsers.value.filter((u) => u.id !== userId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to unblock user'
      throw err
    }
  }

  async function fetchBlockedUsers() {
    loading.value = true
    try {
      const { data } = await connectionService.getBlockedUsers()
      blockedUsers.value = data.content || data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load blocked users'
    } finally {
      loading.value = false
    }
  }

  return {
    friends,
    friendRequests,
    suggestedFriends,
    following,
    followers,
    blockedUsers,
    loading,
    error,
    clearError,
    fetchFriends,
    fetchFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend,
    fetchSuggestedFriends,
    followUser,
    unfollowUser,
    fetchFollowing,
    fetchFollowers,
    blockUser,
    unblockUser,
    fetchBlockedUsers,
  }
})
