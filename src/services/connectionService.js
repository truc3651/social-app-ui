import api from './api'

const FRIENDS_BASE = '/friends'
const FOLLOWS_BASE = '/follows'
const BLOCKS_BASE = '/blocks'

export default {
  getFriends(params = {}) {
    return api.get(FRIENDS_BASE, { params })
  },

  getFriendRequests() {
    return api.get(`${FRIENDS_BASE}/requests`)
  },

  sendFriendRequest(userId) {
    return api.post(`${FRIENDS_BASE}/requests`, { userId })
  },

  acceptFriendRequest(requestId) {
    return api.put(`${FRIENDS_BASE}/requests/${requestId}/accept`)
  },

  rejectFriendRequest(requestId) {
    return api.put(`${FRIENDS_BASE}/requests/${requestId}/reject`)
  },

  cancelFriendRequest(requestId) {
    return api.delete(`${FRIENDS_BASE}/requests/${requestId}`)
  },

  removeFriend(friendId) {
    return api.delete(`${FRIENDS_BASE}/${friendId}`)
  },

  getSuggestedFriends() {
    return api.get(`${FRIENDS_BASE}/suggestions`)
  },

  followUser(userId) {
    return api.post(`${FOLLOWS_BASE}/${userId}`)
  },

  unfollowUser(userId) {
    return api.delete(`${FOLLOWS_BASE}/${userId}`)
  },

  getFollowing(params = {}) {
    return api.get(`${FOLLOWS_BASE}/following`, { params })
  },

  getFollowers(params = {}) {
    return api.get(`${FOLLOWS_BASE}/followers`, { params })
  },

  blockUser(userId) {
    return api.post(`${BLOCKS_BASE}/${userId}`)
  },

  unblockUser(userId) {
    return api.delete(`${BLOCKS_BASE}/${userId}`)
  },

  getBlockedUsers() {
    return api.get(BLOCKS_BASE)
  },
}
