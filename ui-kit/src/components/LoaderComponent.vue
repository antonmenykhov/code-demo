<template>
  <Teleport v-if="isLoaderMounted" :to="target" :disabled="disableTeleport">
    <div class="tnnc-loader" :class="[cssClass]">
      <div class="tnnc-loader-content">
        <i class="tnnc-loader-icon fa-solid fa-spinner"></i>
        <div class="tnnc-loader-text">{{ title }}</div>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    target?: string;
    cssClass?: string;
    disableTeleport?: boolean;
  }>(),
  { target: 'body' },
);
const isLoaderMounted = ref(false);
function mountLoader() {
  const target = document.querySelector(props.target);
  if (target) {
    isLoaderMounted.value = true;
    if (!props.disableTeleport)
      (target as HTMLElement).style.overflow = 'hidden';
  } else {
    setTimeout(() => {
      mountLoader();
    }, 10);
  }
}
mountLoader();
onBeforeUnmount(() => {
  const target = document.querySelector(props.target);
  if (target) {
    (target as HTMLElement).style.overflow = 'auto';
  }
});
</script>
<style>
.tnnc-loader {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.849);
  opacity: 0;
  transition: all 0.2s;
  animation: fade-in 0.2s forwards;
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.tnnc-loader-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tnnc-loader-icon {
  font-size: 50px;
  animation: spin 1.4s forwards infinite;
  transition: all 0.2s;
  aspect-ratio: 1/1;
  margin-bottom: 20px;
  color: var(--tnnc-color-blue);
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.tnnc-loader-text {
  font-weight: 500;
  font-size: 20px;
}
</style>
