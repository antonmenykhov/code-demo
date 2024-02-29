<template>
  <div
    class="tnnc-confirm-wrapper"
    :class="{ 'tnnc-confirm-visible': visible }"
  >
    <div class="tnnc-confirm-message">
      <div class="tnnc-confirm-text">{{ text }}</div>
      <div class="tnnc-confirm-buttons">
        <ButtonComponent
          ref="acceptButton"
          css-class="tnnc-confirm-button"
          text="Да"
          type="success"
          @click="acceptHandler"
        />
        <ButtonComponent
          css-class="tnnc-confirm-button"
          text="Нет"
          type="danger"
          @click="declineHandler"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ButtonComponent from './ButtonComponent.vue';
import { inject, onMounted, ref } from 'vue';

const text = inject('text') as string;
const accept = inject('accept') as () => void;
const decline = inject('decline') as () => void;
const visible = ref(false);
onMounted(() => {
  setTimeout(() => {
    visible.value = true;
    focus();
  }, 20);
});
const acceptButton = ref<InstanceType<typeof ButtonComponent>>();
function focus() {
  if (acceptButton.value) {
    acceptButton.value.$el.focus();
  }
}

function acceptHandler() {
  visible.value = false;
  setTimeout(() => {
    accept();
  }, 150);
}

function declineHandler() {
  visible.value = false;
  setTimeout(() => {
    decline();
  }, 150);
}
</script>
<style>
.tnnc-confirm-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(250, 250, 250, 0.8);
  z-index: 99999;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: 0;
}
.tnnc-confirm-message {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 0 7px 0 #aeaeae;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: scale(0);
}
.tnnc-confirm-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.tnnc-confirm-button {
  width: 100px;
}
.tnnc-confirm-visible.tnnc-confirm-wrapper {
  opacity: 1;
}
.tnnc-confirm-visible .tnnc-confirm-message {
  transform: scale(1);
}
</style>
