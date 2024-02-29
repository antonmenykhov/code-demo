<template>
  <div class="loader-wrapper" :class="{ visible: isVisible }">
    <div class="loader-icon">
      <i class="fa-solid fa-spinner"> </i>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const isVisible = ref(false)
setTimeout(() => {
  isVisible.value = true
}, 1)
</script>
<style lang="scss">
.loader-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.849);
  opacity: 0;
  transition: all 0.2s;
  &.visible {
    opacity: 1;
  }
  .loader-icon {
    animation: rotate 1.4s infinite;
    transition: all 0.2s;
    i {
      font-size: 50px;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
