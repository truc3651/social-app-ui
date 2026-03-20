<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchCurrentUser()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar v-if="authStore.isAuthenticated" />
    <main class="max-w-4xl mx-auto py-6 px-4">
      <router-view />
    </main>
  </div>
</template>
