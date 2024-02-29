<template>
  <div
    class="tnnc-notification-message"
    :class="[type, { showed: showed, hided: hided, heightNull: heightNull }]"
    ref="message"
  >
    <div class="icon">
      <i
        class="fa-solid"
        :class="[type === 'danger' ? 'fa-close' : 'fa-check']"
      ></i>
    </div>
    <div class="text">{{ text }}</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps<{
  text: string;
  duration: number;
  type: 'danger' | 'success';
  id: string;
}>();

const emit = defineEmits<{
  (e: 'ended', data: { id: string }): void;
}>();

const showed = ref(false);
const hided = ref(false);
const heightNull = ref(false);
onMounted(() => {
  setTimeout(() => {
    showed.value = true;
  }, 1);
  setTimeout(() => {
    hided.value = true;
  }, props.duration);
  setTimeout(() => {
    heightNull.value = true;
  }, props.duration + 300);
  setTimeout(() => {
    emit('ended', { id: props.id });
  }, props.duration + 600);
});
</script>
<style>
.tnnc-notification-message {
  padding: 5px;
  max-width: 250px;
  background: rgba(255, 255, 255, 0.885);
  border-radius: 5px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  overflow: hidden;
  transform: translateX(110%);
  opacity: 0;
  box-sizing: content-box;
}
.tnnc-notification-message.showed {
  transform: translateX(0);
  opacity: 1;
}
.tnnc-notification-message.showed.hided {
  opacity: 0;
  transform: translateY(-110px);
}
.tnnc-notification-message.showed.hided.heightNull {
  height: 0;
  padding: 0;
}
.tnnc-notification-message .text {
  flex: 1;
}
.tnnc-notification-message .icon {
  font-size: 14px;
  padding: 5px;
  height: 24px;
  width: 24px;
  margin-right: 10px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tnnc-notification-message.success .icon {
  background: green;
}

.tnnc-notification-message.danger .icon {
  background: red;
}
</style>
