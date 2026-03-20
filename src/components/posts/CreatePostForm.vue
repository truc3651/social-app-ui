<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePostStore } from '@/stores/usePostStore'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { POST_VISIBILITY, VISIBILITY_LABELS } from '@/utils/constants'

const authStore = useAuthStore()
const postStore = usePostStore()

const content = ref('')
const visibility = ref(POST_VISIBILITY.PUBLIC)

const visibilityOptions = Object.entries(VISIBILITY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

async function handleSubmit() {
  if (!content.value.trim()) return
  await postStore.createPost({
    content: content.value,
    visibility: visibility.value,
  })
  content.value = ''
  visibility.value = POST_VISIBILITY.PUBLIC
}
</script>

<template>
  <div class="bg-white border border-gray-300 rounded p-4 mb-4">
    <div class="flex items-start gap-3">
      <UserAvatar
        :src="authStore.user?.avatarUrl"
        :name="authStore.fullName"
      />
      <div class="flex-1">
        <BaseTextarea
          v-model="content"
          placeholder="What's on your mind?"
          :rows="2"
        />
        <div class="flex items-center justify-between mt-2">
          <BaseSelect
            v-model="visibility"
            :options="visibilityOptions"
            class="w-32 mb-0"
          />
          <BaseButton
            :disabled="!content.trim()"
            :loading="postStore.loading"
            @click="handleSubmit"
          >
            Post
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
