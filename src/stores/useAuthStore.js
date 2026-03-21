import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { getCookie, deleteCookie, setCookie } from '@/utils/localStorage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const sessions = ref([])

  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() => user.value?.fullName || '')
  const userId = computed(() => user.value?.id || null)

  function clearError() {
    error.value = null
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.login(credentials)
      setCookie('accessToken', data.accessToken)
      setCookie('refreshToken', data.refreshToken)
      user.value = data.user
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.register(userData)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      user.value = null
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
    }
  }

  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.forgotPassword(email)
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Request failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!getCookie('accessToken')) return
    loading.value = true
    try {
      const { data } = await authService.getCurrentUser()
      user.value = data
    } catch {
      user.value = null
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.updateProfile(profileData)
      user.value = { ...user.value, ...data }
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAvatar(file) {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await authService.updateAvatar(formData)
      user.value = { ...user.value, avatarUrl: data.avatarUrl }
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Avatar update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSessions() {
    loading.value = true
    try {
      const { data } = await authService.getActiveSessions()
      sessions.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load sessions'
    } finally {
      loading.value = false
    }
  }

  async function revokeSession(sessionId) {
    try {
      await authService.revokeSession(sessionId)
      sessions.value = sessions.value.filter((s) => s.id !== sessionId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to revoke session'
    }
  }

  async function revokeAllOtherSessions() {
    try {
      await authService.revokeAllOtherSessions()
      sessions.value = sessions.value.filter((s) => s.current)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to revoke sessions'
    }
  }

  return {
    user,
    loading,
    error,
    sessions,
    isAuthenticated,
    fullName,
    userId,
    clearError,
    login,
    register,
    logout,
    forgotPassword,
    fetchCurrentUser,
    updateProfile,
    updateAvatar,
    fetchSessions,
    revokeSession,
    revokeAllOtherSessions,
  }
})
