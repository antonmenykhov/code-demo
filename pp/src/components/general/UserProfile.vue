<template>
  <div class="profile-container" :class="{ toggled: isMessagesVisible }">
    <div class="name">{{ keycloak.tokenParsed?.displayName }}</div>
    <button
      class="notification-button"
      :class="{ 'has-messages': messages.length > 0 }"
      @click="toggleMessages"
    >
      <i class="fa-solid fa-bell"></i>
    </button>
    <div class="message-list" :class="{ visible: isMessagesVisible }">
      <div class="message-container">
        <div class="message" v-if="messages.length === 0">
          <div class="text">Уведомлений нет</div>
        </div>
        <div class="message" v-for="(message, index) in messages" :key="index">
          <div class="text">{{ message.text }}</div>
          <div class="date">{{ useDateFormat(message.date, 'DD.MM.YYYY HH.mm.ss').value }}</div>
          <button class="notification-button close-button" @click="deleteMessage(index)">
            <i class="fa-solid fa-close"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useLocksHttp from '@/composables/http/use-locks-http.composable'
import useEventSource from '@/composables/useEventSource.composable'
import { useLockStore } from '@/store/lock.store'
import { tryOnBeforeUnmount, useDateFormat } from '@vueuse/core'
import type { KeycloakInstance } from 'keycloak-js'
import { storeToRefs } from 'pinia'
import { notify } from 'tnnc-ui-kit'
import { inject, onMounted, ref } from 'vue'
const keycloak = inject('keycloak') as KeycloakInstance
const { source } = useEventSource()
onMounted(() => {
  getInitialLockState()
  source.addEventListener('message', messageHandler)
})
tryOnBeforeUnmount(() => {
  source.removeEventListener('message', messageHandler)
})
export type Message = {
  text: string
  date: string
}
const messages = ref<Message[]>([])

const { lockData } = storeToRefs(useLockStore())
function messageHandler(e: MessageEvent) {
  const data = JSON.parse(e.data)
  if (data.type === 'fullLock') {
    if (data.lockData.isLocked !== lockData.value?.isLocked) {
      if (data.lockData.isLocked) {
        addMessage(
          `Редактирование запрещено. Идет формирование отчетности. Блокировку установил(а): ${data.lockData.userName}, (${data.lockData.userEmail})`,
          data.lockData.date,
          'danger'
        )
      } else {
        if (lockData.value)
          addMessage(`Редактирование разрешено. Блокировка снята`, data.lockData.date)
      }
    }
    lockData.value = data.lockData
  }
}
function addMessage(text: string, date: string = '', type: 'danger' | 'success' = 'success') {
  notify(text, type, 9000)
  messages.value.push({ text, date })
}

function deleteMessage(index: number) {
  messages.value.splice(index, 1)
}
const isMessagesVisible = ref(false)
function toggleMessages() {
  isMessagesVisible.value = !isMessagesVisible.value
}
const { getSuppLocks } = useLocksHttp()
function getInitialLockState() {
  getSuppLocks().then(({ data }) => {
    lockData.value = data
    if (lockData.value?.isLocked) {
      addMessage(
        `Редактирование запрещено. Идет формирование отчетности. Блокировку установил(а): ${lockData.value.userName}, (${lockData.value.userEmail})`,
        lockData.value.date,
        'danger'
      )
    }
  })
}
</script>
<style lang="scss">
.profile-container {
  position: absolute;
  bottom: 20px;
  left: -25px;
  right: -15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--tnnc-add-color-gray-4);
  padding: 20px 25px;
  transition: all 0.2s;
  &.toggled {
    background: var(--tnnc-add-color-gray-3);
  }
}
.notification-button {
  aspect-ratio: 1/1;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: var(--tnnc-color-gray-light);
  transition: all 0.2s;
  cursor: pointer;
  i {
    font-size: 16px;
    color: var(--tnnc-add-color-gray-1);
  }
  &:hover {
    background: white;
  }
  &:active {
    background: var(--tnnc-color-gray-standart);
  }
  &.has-messages::after {
    position: absolute;
    right: 0;
    top: 0;
    height: 7px;
    aspect-ratio: 1/1;
    content: '';
    background: var(--tnnc-color-red);
    border-radius: 50%;
  }
}
.message-container {
  overflow: visible;
  height: fit-content;
  overflow: auto;
}
.message-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: absolute;
  left: 0;
  bottom: 100%;
  right: 0;
  max-height: calc(100vh - 100%);
  background: var(--tnnc-add-color-gray-4);
  padding: 10px;
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translateX(-100%);
  overflow: hidden;
  opacity: 0;
  &.visible {
    transform: translateX(0);
    opacity: 1;
  }
  .message {
    background: white;
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
    margin-right: 5px;
    .text {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .date {
      font-size: 12px;
      text-align: right;
      margin-top: 5px;
    }
    .close-button:hover {
      background: var(--tnnc-add-color-gray-4);
    }
    .close-button:active {
      background: var(--tnnc-add-color-gray-3);
    }
    .close-button {
      transition: all 0.2s ease-in-out;
      position: absolute;
      top: 10px;
      right: 10px;
      transform: translateX(50px);
      height: 20px;
      i {
        font-size: 14px;
      }
    }
    &:hover .close-button {
      transform: translateX(0);
    }
  }
}
.tnnc-notification-message {
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
