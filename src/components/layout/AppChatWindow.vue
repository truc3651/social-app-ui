<script setup>
import { computed, ref, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  recipient: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const draftMessage = ref('')
const isMinimized = ref(false)
const messageMap = ref({})

const recipientName = computed(() => props.recipient?.fullName || 'Chat')
const recipientAvatar = computed(() => props.recipient?.avatarUrl || '')
const recipientId = computed(() => props.recipient?.id || 'default')
const messages = computed(() => messageMap.value[recipientId.value] || [])

function getWelcomeMessage() {
  if (props.recipient?.isBot) {
    return 'Welcome! How can we help you today?'
  }

  return `You are now chatting with ${recipientName.value}.`
}

function initializeConversation() {
  if (!messageMap.value[recipientId.value]) {
    messageMap.value[recipientId.value] = [
      {
        id: `${recipientId.value}-welcome`,
        sender: recipientName.value,
        text: getWelcomeMessage(),
        own: false,
      },
    ]
  }
}

watch(
  () => props.recipient,
  () => {
    initializeConversation()
    isMinimized.value = false
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      isMinimized.value = false
    }
  }
)

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
}

function sendMessage() {
  const content = draftMessage.value.trim()

  if (!content) {
    return
  }

  initializeConversation()
  messageMap.value[recipientId.value].push({
    id: Date.now(),
    sender: 'You',
    text: content,
    own: true,
  })

  draftMessage.value = ''
}
</script>

<template>
  <div
    v-if="isOpen && recipient"
    class="fixed right-4 bottom-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] bg-white border border-gray-300 rounded-lg shadow-xl"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div class="flex items-center gap-2 min-w-0">
        <UserAvatar :src="recipientAvatar" :name="recipientName" size="sm" />
        <h3 class="text-sm font-semibold text-gray-800 truncate">{{ recipientName }}</h3>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="text-gray-500 hover:text-gray-700 text-base leading-none cursor-pointer"
          @click="toggleMinimize"
        >
          {{ isMinimized ? '+' : '-' }}
        </button>
        <button
          class="text-gray-500 hover:text-gray-700 text-lg leading-none cursor-pointer"
          @click="emit('close')"
        >
          &times;
        </button>
      </div>
    </div>

    <template v-if="!isMinimized">
      <div class="h-72 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        <div
          v-for="message in messages"
          :key="message.id"
          class="max-w-[85%] px-3 py-2 rounded text-sm"
          :class="message.own ? 'ml-auto bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'"
        >
          <p class="font-medium text-xs mb-1" :class="message.own ? 'text-blue-100' : 'text-gray-500'">
            {{ message.sender }}
          </p>
          <p>{{ message.text }}</p>
        </div>
      </div>

      <div class="border-t border-gray-200 px-4 py-3">
        <BaseInput
          v-model="draftMessage"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
        />
        <div class="flex justify-end">
          <BaseButton size="sm" @click="sendMessage">Send</BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>
