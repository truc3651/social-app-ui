<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useConnectionStore } from '@/stores/useConnectionStore'
import UserAvatar from '@/components/common/UserAvatar.vue'
import AppChatWindow from '@/components/layout/AppChatWindow.vue'

const router = useRouter()
const authStore = useAuthStore()
const connectionStore = useConnectionStore()
const showDropdown = ref(false)
const showChatWindow = ref(false)
const showFriendList = ref(false)
const searchQuery = ref('')
const activeChatRecipient = ref(null)

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

function openBotChat() {
  activeChatRecipient.value = {
    id: 'bot-assistant',
    fullName: 'Bot Assistant',
    avatarUrl: '',
    isBot: true,
  }
  showFriendList.value = false
  showChatWindow.value = true
}

async function toggleFriendList() {
  showFriendList.value = !showFriendList.value

  if (showFriendList.value && !connectionStore.friends.length && !connectionStore.loading) {
    await connectionStore.fetchFriends()
  }
}

function openFriendChat(friend) {
  activeChatRecipient.value = {
    id: friend.id,
    fullName: friend.fullName,
    avatarUrl: friend.avatarUrl,
    isBot: false,
  }
  showFriendList.value = false
  showChatWindow.value = true
}

function closeChatWindow() {
  showChatWindow.value = false
  activeChatRecipient.value = null
}

function handleSearch() {
  const query = searchQuery.value.trim()

  if (!query) {
    return
  }

  router.push({
    name: 'newsfeed',
    query: { q: query },
  })
}
</script>

<template>
  <nav class="bg-white border-b border-gray-300 sticky top-0 z-40">
    <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
      <router-link to="/" class="text-lg font-bold text-blue-600 no-underline">
        Elite Nexus
      </router-link>

      <div class="hidden md:flex flex-1 max-w-sm">
        <div class="w-full flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="handleSearch"
          />
          <button
            class="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
            @click="handleSearch"
          >
            Search
          </button>
        </div>
      </div>

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
        <button
          class="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
          @click="openBotChat"
        >
          Chat with Bot
        </button>
        <div class="relative">
          <button
            class="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
            @click="toggleFriendList"
          >
            Friends Chat
          </button>
          <div
            v-if="showFriendList"
            class="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-300 rounded shadow-md z-50"
          >
            <div class="px-3 py-2 border-b border-gray-200">
              <p class="text-sm font-medium text-gray-800">Friend List</p>
            </div>
            <div v-if="connectionStore.loading" class="px-3 py-3 text-sm text-gray-500">
              Loading friends...
            </div>
            <div v-else-if="connectionStore.error" class="px-3 py-3 text-sm text-red-600">
              {{ connectionStore.error }}
            </div>
            <div v-else-if="!connectionStore.friends.length" class="px-3 py-3 text-sm text-gray-500">
              No friends available.
            </div>
            <button
              v-for="friend in connectionStore.friends"
              v-else
              :key="friend.id"
              class="w-full px-3 py-2 text-left hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              @click="openFriendChat(friend)"
            >
              <UserAvatar
                :src="friend.avatarUrl"
                :name="friend.fullName"
                size="sm"
              />
              <div class="min-w-0">
                <p class="text-sm text-gray-800 truncate">{{ friend.fullName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ friend.email }}</p>
              </div>
            </button>
          </div>
        </div>

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
  <AppChatWindow
    :is-open="showChatWindow"
    :recipient="activeChatRecipient"
    @close="closeChatWindow"
  />
</template>
