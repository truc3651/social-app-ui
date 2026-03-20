import api from './api'

const AUTH_BASE = '/auth'

export default {
  login(credentials) {
    return api.post(`${AUTH_BASE}/login`, credentials)
  },

  register(userData) {
    return api.post(`${AUTH_BASE}/register`, userData)
  },

  logout() {
    return api.post(`${AUTH_BASE}/logout`)
  },

  forgotPassword(email) {
    return api.post(`${AUTH_BASE}/forgot-password`, { email })
  },

  resetPassword(payload) {
    return api.post(`${AUTH_BASE}/reset-password`, payload)
  },

  getCurrentUser() {
    return api.get(`${AUTH_BASE}/me`)
  },

  updateProfile(profileData) {
    return api.put(`${AUTH_BASE}/profile`, profileData)
  },

  updateAvatar(formData) {
    return api.put(`${AUTH_BASE}/profile/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getActiveSessions() {
    return api.get(`${AUTH_BASE}/sessions`)
  },

  revokeSession(sessionId) {
    return api.delete(`${AUTH_BASE}/sessions/${sessionId}`)
  },

  revokeAllOtherSessions() {
    return api.delete(`${AUTH_BASE}/sessions`)
  },
}
