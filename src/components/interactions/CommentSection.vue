<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInteractionStore } from '@/stores/useInteractionStore'
import CommentItem from './CommentItem.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true,
  },
})

const interactionStore = useInteractionStore()

const newCommentText = ref('')
const replyingTo = ref(null)

const comments = computed(() => {
  return interactionStore.commentsByPost[props.postId] || []
})

const rootComments = computed(() => {
  return comments.value.filter((c) => !c.parentCommentId)
})

function getChildComments(parentId) {
  return comments.value.filter((c) => c.parentCommentId === parentId)
}

onMounted(() => {
  interactionStore.fetchPostComments(props.postId)
})

function startReply(comment) {
  replyingTo.value = comment
  newCommentText.value = ''
}

function cancelReply() {
  replyingTo.value = null
  newCommentText.value = ''
}

async function submitComment() {
  if (!newCommentText.value.trim()) return
  await interactionStore.createComment(
    props.postId,
    newCommentText.value,
    replyingTo.value?.id || null,
  )
  newCommentText.value = ''
  replyingTo.value = null
}
</script>

<template>
  <div>
    <div v-if="interactionStore.loading" class="text-xs text-gray-400">Loading comments...</div>

    <div v-else>
      <div v-for="comment in rootComments" :key="comment.id">
        <CommentItem
          :comment="comment"
          :post-id="postId"
          @reply="startReply"
        />
        <CommentItem
          v-for="child in getChildComments(comment.id)"
          :key="child.id"
          :comment="child"
          :post-id="postId"
          :is-child="true"
        />
      </div>

      <p v-if="rootComments.length === 0" class="text-xs text-gray-400 py-2">
        No comments yet. Be the first!
      </p>
    </div>

    <div class="mt-3 pt-2 border-t border-gray-100">
      <div v-if="replyingTo" class="text-xs text-blue-600 mb-1 flex items-center gap-2">
        Replying to {{ replyingTo.author?.fullName }}
        <button class="text-gray-400 hover:text-gray-600 cursor-pointer" @click="cancelReply">
          &times;
        </button>
      </div>
      <div class="flex gap-2">
        <input
          v-model="newCommentText"
          type="text"
          :placeholder="replyingTo ? 'Write a reply...' : 'Write a comment...'"
          class="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          @keyup.enter="submitComment"
        />
        <BaseButton
          size="sm"
          :disabled="!newCommentText.trim()"
          @click="submitComment"
        >
          Send
        </BaseButton>
      </div>
    </div>
  </div>
</template>
