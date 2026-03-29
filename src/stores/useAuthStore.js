import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { getCookie, deleteCookie, setCookie } from '@/utils/localStorage'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/utils/constants'

/** Map ProfileResponseDto into store user; keeps avatarUrl for existing UI. */
function mapProfile(dto) {
  if (!dto) return null
  return {
    ...dto,
    avatarUrl: dto.profilePictureUrl ?? '',
  }
}

function apiErrorMessage(err) {
  const d = err.response?.data
  return d?.message || d?.error || 'Request failed'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const sessions = ref([])

  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() => user.value?.fullName || '')
  const userId = computed(() => user.value?.id ?? null)

  function clearError() {
    error.value = null
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.login(credentials)
      setCookie(ACCESS_TOKEN, data.accessToken)
      setCookie(REFRESH_TOKEN, data.refreshToken)
      const { data: profile } = await authService.getProfile()
      user.value = mapProfile(profile)
      return data
    } catch (err) {
      error.value = apiErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      await authService.register(userData)
    } catch (err) {
      error.value = apiErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    const refreshToken = getCookie(REFRESH_TOKEN)
    try {
      if (refreshToken) {
        await authService.logout({ refreshToken })
      }
    } finally {
      user.value = null
      deleteCookie(ACCESS_TOKEN)
      deleteCookie(REFRESH_TOKEN)
    }
  }

  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    try {
      await authService.forgotPassword({ email })
    } catch (err) {
      error.value = apiErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!getCookie(ACCESS_TOKEN)) return
    loading.value = true
    try {
      const { data } = await authService.getProfile()
      user.value = mapProfile(data)
    } catch {
      user.value = null
      deleteCookie(ACCESS_TOKEN)
      deleteCookie(REFRESH_TOKEN)
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authService.updateProfile(profileData)
      user.value = mapProfile({ ...user.value, ...data })
      return data
    } catch (err) {
      error.value = apiErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSessions() {
    const currentRefreshToken = getCookie(REFRESH_TOKEN)
    if (!currentRefreshToken) {
      sessions.value = []
      return
    }
    loading.value = true
    try {
      const { data } = await authService.listSessions({
        currentRefreshToken,
      })
      sessions.value = data
    } catch (err) {
      error.value = apiErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function revokeSession(targetRefreshToken) {
    const currentRefreshToken = getCookie(REFRESH_TOKEN)
    if (!currentRefreshToken || !targetRefreshToken) return
    try {
      await authService.revokeSession({
        currentRefreshToken,
        targetRefreshToken,
      })
      sessions.value = sessions.value.filter((s) => s.token !== targetRefreshToken)
    } catch (err) {
      error.value = apiErrorMessage(err)
    }
  }

  async function revokeAllOtherSessions() {
    const currentRefreshToken = getCookie(REFRESH_TOKEN)
    if (!currentRefreshToken) return
    try {
      await authService.revokeOtherSessions({ currentRefreshToken })
      sessions.value = sessions.value.filter((s) => s.current)
    } catch (err) {
      error.value = apiErrorMessage(err)
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
    fetchSessions,
    revokeSession,
    revokeAllOtherSessions,
  }
})
