<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePostStore } from '@/stores/usePostStore'
import UserAvatar from '@/components/common/UserAvatar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ReactionBar from '@/components/interactions/ReactionBar.vue'
import CommentSection from '@/components/interactions/CommentSection.vue'
import { timeAgo } from '@/utils/formatDate'
import { VISIBILITY_LABELS, POST_VISIBILITY } from '@/utils/constants'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()

const isEditing = ref(false)
const editContent = ref('')
const editVisibility = ref('')
const showDeleteDialog = ref(false)
const showComments = ref(false)

const isOwner = computed(() => String(props.post.author?.id) === String(authStore.userId))

const visibilityOptions = Object.entries(VISIBILITY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

function startEditing() {
  editContent.value = props.post.content
  editVisibility.value = props.post.visibility || POST_VISIBILITY.PUBLIC
  isEditing.value = true
}

async function saveEdit() {
  await postStore.updatePost(props.post.id, {
    content: editContent.value,
    visibility: editVisibility.value,
  })
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

async function confirmDelete() {
  await postStore.deletePost(props.post.id)
  showDeleteDialog.value = false
}

function viewAuthorProfile() {
  router.push({ name: 'profile', params: { userId: props.post.author?.id } })
}
</script>

<template>
  <div class="bg-white border border-gray-300 rounded p-4">
    <div class="flex items-start gap-3 mb-3">
      <UserAvatar
        :src="post.author?.avatarUrl"
        :name="post.author?.fullName"
        class="cursor-pointer"
        @click="viewAuthorProfile"
      />
      <div class="flex-1">
        <p
          class="text-sm font-medium text-gray-800 cursor-pointer hover:underline"
          @click="viewAuthorProfile"
        >
          {{ post.author?.fullName }}
        </p>
        <p class="text-xs text-gray-400">
          {{ timeAgo(post.createdAt) }}
          <span class="mx-1">&middot;</span>
          {{ VISIBILITY_LABELS[post.visibility] || 'Public' }}
        </p>
      </div>
      <div v-if="isOwner" class="flex gap-1">
        <BaseButton variant="ghost" size="sm" @click="startEditing">Edit</BaseButton>
        <BaseButton variant="ghost" size="sm" @click="showDeleteDialog = true">Delete</BaseButton>
      </div>
    </div>

    <div v-if="post.taggedUsers?.length" class="mb-2">
      <span class="text-xs text-gray-500">
        Tagged:
        <span v-for="(taggedUser, idx) in post.taggedUsers" :key="taggedUser.id">
          <router-link
            :to="{ name: 'profile', params: { userId: taggedUser.id } }"
            class="text-blue-600 hover:underline"
          >{{ taggedUser.fullName }}</router-link><span v-if="idx < post.taggedUsers.length - 1">, </span>
        </span>
      </span>
    </div>

    <template v-if="isEditing">
      <BaseTextarea v-model="editContent" :rows="3" />
      <BaseSelect v-model="editVisibility" :options="visibilityOptions" class="w-32" />
      <div class="flex gap-2 mt-2">
        <BaseButton size="sm" @click="saveEdit">Save</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="cancelEdit">Cancel</BaseButton>
      </div>
    </template>
    <template v-else>
      <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ post.content }}</p>
    </template>

    <div class="mt-3 pt-3 border-t border-gray-200">
      <ReactionBar :post-id="post.id" :reactions="post.reactions" />
    </div>

    <div class="mt-2">
      <button
        class="text-xs text-gray-500 hover:text-blue-600 cursor-pointer"
        @click="showComments = !showComments"
      >
        {{ showComments ? 'Hide Comments' : `Comments (${post.commentCount || 0})` }}
      </button>

      <CommentSection
        v-if="showComments"
        :post-id="post.id"
        class="mt-3"
      />
    </div>

    <ConfirmDialog
      v-if="showDeleteDialog"
      title="Delete Post"
      message="Are you sure you want to delete this post? This action cannot be undone."
      confirm-text="Delete"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
