<script setup>
import { ref, computed } from 'vue'
import { useInteractionStore } from '@/stores/useInteractionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { REACTION_TYPES, REACTION_EMOJI } from '@/utils/constants'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true,
  },
  reactions: {
    type: Object,
    default: () => ({}),
  },
})

const interactionStore = useInteractionStore()
const authStore = useAuthStore()
const showPicker = ref(false)

const reactionData = computed(() => {
  return interactionStore.reactionsByPost[props.postId] || props.reactions || {}
})

const currentUserReaction = computed(() => {
  return reactionData.value?.currentUserReaction || null
})

const reactionCounts = computed(() => {
  return reactionData.value?.counts || {}
})

const totalReactions = computed(() => {
  return Object.values(reactionCounts.value).reduce((sum, count) => sum + count, 0)
})

async function handleReaction(type) {
  showPicker.value = false
  if (currentUserReaction.value === type) {
    await interactionStore.removeReaction(props.postId)
  } else {
    await interactionStore.reactToPost(props.postId, type)
  }
}

function togglePicker() {
  showPicker.value = !showPicker.value
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="relative">
      <button
        class="text-sm px-2 py-1 rounded border cursor-pointer"
        :class="currentUserReaction
          ? 'border-blue-300 bg-blue-50 text-blue-600'
          : 'border-gray-300 text-gray-500 hover:bg-gray-50'"
        @click="togglePicker"
      >
        {{ currentUserReaction ? REACTION_EMOJI[currentUserReaction] : '\u{1F44D}' }}
        {{ currentUserReaction ? REACTION_EMOJI[currentUserReaction] + ' ' : '' }}Like
      </button>

      <div
        v-if="showPicker"
        class="absolute bottom-full left-0 mb-1 bg-white border border-gray-300 rounded shadow p-1 flex gap-1 z-10"
      >
        <button
          v-for="type in REACTION_TYPES"
          :key="type"
          class="text-lg hover:scale-125 transition-transform cursor-pointer px-1"
          :class="currentUserReaction === type ? 'bg-blue-100 rounded' : ''"
          :title="type"
          @click="handleReaction(type)"
        >
          {{ REACTION_EMOJI[type] }}
        </button>
      </div>
    </div>

    <div v-if="totalReactions > 0" class="text-xs text-gray-500 flex items-center gap-1">
      <span
        v-for="(count, type) in reactionCounts"
        :key="type"
        :title="`${count} ${type}`"
      >
        {{ REACTION_EMOJI[type] }} {{ count }}
      </span>
    </div>
  </div>
</template>
