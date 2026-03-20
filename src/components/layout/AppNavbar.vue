<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function navigateTo(routeName, params = {}) {
  closeDropdown()
  router.push({ name: routeName, params })
}
</script>

<template>
  <nav class="bg-white border-b border-gray-300 sticky top-0 z-40">
    <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
      <router-link to="/" class="text-lg font-bold text-blue-600 no-underline">
        Elite Nexus
      </router-link>

      <div class="flex items-center gap-4">
        <router-link
          to="/"
          class="text-sm text-gray-600 hover:text-blue-600 no-underline"
        >
          Feed
        </router-link>
        <router-link
          to="/friends"
          class="text-sm text-gray-600 hover:text-blue-600 no-underline"
        >
          Friends
        </router-link>

        <div class="relative">
          <button class="flex items-center gap-2 cursor-pointer" @click="toggleDropdown">
            <UserAvatar
              :src="authStore.user?.avatarUrl"
              :name="authStore.fullName"
              size="sm"
            />
            <span class="text-sm text-gray-700 hidden sm:inline">
              {{ authStore.fullName }}
            </span>
          </button>

          <div
            v-if="showDropdown"
            class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow-md z-50"
          >
            <button
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('profile', { userId: authStore.userId })"
            >
              My Profile
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('friend-suggestions')"
            >
              Suggestions
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('tagged-posts')"
            >
              Tagged Posts
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              @click="navigateTo('session-management')"
            >
              Sessions
            </button>
            <hr class="border-gray-200" />
            <button
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
