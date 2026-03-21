import axios from 'axios'
import { getCookie, deleteCookie } from '@/utils/localStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getCookie('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
