import api from './api'

/** Paths align with OpenAPI 3.1 (backend-users-api): /v1/api/... */
const ROOT = 'v1/api'

export default {
  login(body) {
    return api.post(`${ROOT}/auth/login`, body)
  },

  register(body) {
    return api.post(`${ROOT}/auth/register`, body)
  },

  logout(body) {
    return api.post(`${ROOT}/auth/logout`, body)
  },

  refreshToken(body) {
    return api.post(`${ROOT}/auth/refresh`, body)
  },

  validateToken(body) {
    return api.post(`${ROOT}/auth/validate-token`, body)
  },

  forgotPassword(body) {
    return api.post(`${ROOT}/auth/forgot-password`, body)
  },

  resetPassword(body) {
    return api.post(`${ROOT}/auth/reset-password`, body)
  },

  getProfile() {
    return api.get(`${ROOT}/me/profile`)
  },

  updateProfile(body) {
    return api.put(`${ROOT}/me/profile`, body)
  },

  listSessions(params) {
    return api.get(`${ROOT}/me/sessions`, { params })
  },

  revokeSession(body) {
    return api.post(`${ROOT}/me/sessions/revoke`, body)
  },

  revokeOtherSessions(body) {
    return api.post(`${ROOT}/me/sessions/revoke-others`, body)
  },

  changePassword(body) {
    return api.post(`${ROOT}/me/change-password`, body)
  },
}
