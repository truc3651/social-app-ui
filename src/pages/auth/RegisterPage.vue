<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const validationError = ref('')
const successMessage = ref('')

function validate() {
  if (password.value.length < 6) {
    validationError.value = 'Password must be at least 6 characters'
    return false
  }
  if (password.value !== confirmPassword.value) {
    validationError.value = 'Passwords do not match'
    return false
  }
  validationError.value = ''
  return true
}

async function handleRegister() {
  if (!validate()) return
  authStore.clearError()
  try {
    await authStore.register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })
    successMessage.value = 'Account created! You can now sign in.'
    setTimeout(() => router.push({ name: 'login' }), 2000)
  } catch {
    // error is set in the store
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16">
    <div class="bg-white border border-gray-300 rounded p-6">
      <h1 class="text-xl font-bold text-gray-800 mb-1">Create Account</h1>
      <p class="text-sm text-gray-500 mb-6">Join Elite Nexus today</p>

      <BaseAlert
        v-if="successMessage"
        type="success"
        :message="successMessage"
        class="mb-4"
      />
      <BaseAlert
        v-if="authStore.error || validationError"
        type="error"
        :message="authStore.error || validationError"
        class="mb-4"
      />

      <form @submit.prevent="handleRegister">
        <BaseInput
          v-model="fullName"
          label="Full Name"
          placeholder="John Doe"
        />
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
          placeholder="At least 6 characters"
        />
        <BaseInput
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
        />
        <BaseButton
          type="submit"
          class="w-full"
          :loading="authStore.loading"
          :disabled="!fullName || !email || !password || !confirmPassword"
        >
          Create Account
        </BaseButton>
      </form>

      <p class="mt-4 text-sm text-center text-gray-500">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>
