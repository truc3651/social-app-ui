<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  authStore.clearError()
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push({ name: 'newsfeed' })
  } catch {
    // error is set in the store
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16">
    <div class="bg-white border border-gray-300 rounded p-6">
      <h1 class="text-xl font-bold text-gray-800 mb-1">Sign In</h1>
      <p class="text-sm text-gray-500 mb-6">Welcome back to SocialApp</p>

      <BaseAlert
        v-if="authStore.error"
        type="error"
        :message="authStore.error"
        class="mb-4"
      />

      <form @submit.prevent="handleLogin">
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="Your password"
        />
        <BaseButton
          type="submit"
          class="w-full"
          :loading="authStore.loading"
          :disabled="!email || !password"
        >
          Sign In
        </BaseButton>
      </form>

      <div class="mt-4 text-sm text-center space-y-2">
        <router-link to="/forgot-password" class="text-blue-600 hover:underline block">
          Forgot password?
        </router-link>
        <p class="text-gray-500">
          Don't have an account?
          <router-link to="/register" class="text-blue-600 hover:underline">
            Sign Up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
