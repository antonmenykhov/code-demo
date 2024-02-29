<template>
  <div class="tnnc-notification-panel">
    <NotificationMessage
      v-for="message in notificationPool"
      :key="message.id"
      :text="message.text"
      :duration="message.duration"
      :type="message.type"
      :id="message.id"
      @ended="onShowingEnded"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import NotificationMessage from './NotificationMessage.vue';
import useUUID from '@/composables/useUUID';

export interface NotificationMessageType {
  text: string;
  duration: number;
  type: 'danger' | 'success';
}

const notificationPool: Ref<Array<NotificationMessageType & { id: string }>> =
  ref([]);

function onShowingEnded(e: { id: string }) {
  const existIndex = notificationPool.value.findIndex(
    (message) => message.id === e.id,
  );
  notificationPool.value.splice(existIndex, 1);
}

onMounted(() => {
  document.addEventListener(
    'tnnc-add-notification',
    addNotification as EventListener,
  );
});

onBeforeUnmount(() => {
  document.removeEventListener(
    'tnnc-add-notification',
    addNotification as EventListener,
  );
});

function addNotification(event: CustomEvent<NotificationMessageType>) {
  const { id } = useUUID();
  notificationPool.value.push({ ...event.detail, id: id.value });
}
</script>
<style>
.tnnc-notification-panel {
  position: fixed;
  z-index: 99999;
  right: 0;
  top: 0;
  height: fit-content;
  width: fit-content;
  padding: 10px;
  display: flex;
  gap: 5px;
  flex-direction: column;
  transition: all 0.3s;
}
</style>
