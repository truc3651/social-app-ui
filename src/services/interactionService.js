import api from './api'

const REACTIONS_BASE = '/reactions'
const COMMENTS_BASE = '/comments'

export default {
  getPostReactions(postId) {
    return api.get(`${REACTIONS_BASE}/post/${postId}`)
  },

  reactToPost(postId, reactionType) {
    return api.post(REACTIONS_BASE, { postId, reactionType })
  },

  removeReaction(postId) {
    return api.delete(`${REACTIONS_BASE}/post/${postId}`)
  },

  getPostComments(postId, params = {}) {
    return api.get(`${COMMENTS_BASE}/post/${postId}`, { params })
  },

  createComment(postId, content, parentCommentId = null) {
    return api.post(COMMENTS_BASE, { postId, content, parentCommentId })
  },

  deleteComment(commentId) {
    return api.delete(`${COMMENTS_BASE}/${commentId}`)
  },

  likeComment(commentId) {
    return api.post(`${COMMENTS_BASE}/${commentId}/like`)
  },

  unlikeComment(commentId) {
    return api.delete(`${COMMENTS_BASE}/${commentId}/like`)
  },
}
