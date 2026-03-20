import api from './api'

const POSTS_BASE = '/posts'

export default {
  getFeed(params = {}) {
    return api.get(`${POSTS_BASE}/feed`, { params })
  },

  getPostById(postId) {
    return api.get(`${POSTS_BASE}/${postId}`)
  },

  getUserPosts(userId, params = {}) {
    return api.get(`${POSTS_BASE}/user/${userId}`, { params })
  },

  getTaggedPosts(userId, params = {}) {
    return api.get(`${POSTS_BASE}/tagged/${userId}`, { params })
  },

  createPost(postData) {
    return api.post(POSTS_BASE, postData)
  },

  updatePost(postId, postData) {
    return api.put(`${POSTS_BASE}/${postId}`, postData)
  },

  deletePost(postId) {
    return api.delete(`${POSTS_BASE}/${postId}`)
  },
}
