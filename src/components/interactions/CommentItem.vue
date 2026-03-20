<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useInteractionStore } from '@/stores/useInteractionStore'
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { timeAgo } from '@/utils/formatDate'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  postId: {
    type: [String, Number],
    required: true,
  },
  isChild: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['reply'])

const authStore = useAuthStore()
const interactionStore = useInteractionStore()

const isOwner = computed(() => String(props.comment.author?.id) === String(authStore.userId))
const isLiked = ref(props.comment.likedByCurrentUser || false)
const likeCount = ref(props.comment.likeCount || 0)

async function toggleLike() {
  if (isLiked.value) {
    await interactionStore.unlikeComment(props.comment.id)
    likeCount.value--
  } else {
    await interactionStore.likeComment(props.comment.id)
    likeCount.value++
  }
  isLiked.value = !isLiked.value
}

async function handleDelete() {
  await interactionStore.deleteComment(props.postId, props.comment.id)
}
</script>

<template>
  <div :class="isChild ? 'ml-8 pl-3 border-l-2 border-gray-200' : ''">
    <div class="flex items-start gap-2 py-2">
      <UserAvatar
        :src="comment.author?.avatarUrl"
        :name="comment.author?.fullName"
        size="sm"
      />
      <div class="flex-1 min-w-0">
        <div class="bg-gray-50 rounded px-3 py-2">
          <p class="text-xs font-medium text-gray-800">{{ comment.author?.fullName }}</p>
          <p class="text-sm text-gray-700 mt-0.5">{{ comment.content }}</p>
        </div>
        <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span>{{ timeAgo(comment.createdAt) }}</span>
          <button
            class="cursor-pointer hover:text-blue-600"
            :class="isLiked ? 'text-blue-600 font-medium' : ''"
            @click="toggleLike"
          >
            Like{{ likeCount > 0 ? ` (${likeCount})` : '' }}
          </button>
          <button
            v-if="!isChild"
            class="cursor-pointer hover:text-blue-600"
            @click="$emit('reply', comment)"
          >
            Reply
          </button>
          <button
            v-if="isOwner"
            class="cursor-pointer hover:text-red-600"
            @click="handleDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
