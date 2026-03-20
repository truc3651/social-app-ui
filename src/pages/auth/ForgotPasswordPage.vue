<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const authStore = useAuthStore()

const email = ref('')
const successMessage = ref('')

async function handleSubmit() {
  authStore.clearError()
  successMessage.value = ''
  try {
    await authStore.forgotPassword(email.value)
    successMessage.value = 'If that email exists, a reset link has been sent.'
  } catch {
    // error is set in the store
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16">
    <div class="bg-white border border-gray-300 rounded p-6">
      <h1 class="text-xl font-bold text-gray-800 mb-1">Forgot Password</h1>
      <p class="text-sm text-gray-500 mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      <BaseAlert
        v-if="successMessage"
        type="success"
        :message="successMessage"
        class="mb-4"
      />
      <BaseAlert
        v-if="authStore.error"
        type="error"
        :message="authStore.error"
        class="mb-4"
      />

      <form @submit.prevent="handleSubmit">
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <BaseButton
          type="submit"
          class="w-full"
          :loading="authStore.loading"
          :disabled="!email"
        >
          Send Reset Link
        </BaseButton>
      </form>

      <p class="mt-4 text-sm text-center">
        <router-link to="/login" class="text-blue-600 hover:underline">
          Back to Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>
