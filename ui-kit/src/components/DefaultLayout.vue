<template>
  <div class="tnnc-container tnnc-default-layout">
    <aside :class="{ 'tnnc-aside-visible': menuVisible }" ref="aside">
      <div
        class="tnnc-aside-content"
        :class="{ 'tnnc-aside-content-visible': sideContentVisible }"
      >
        <slot name="side"></slot>
      </div>
      <div class="tnnc-aside-button-wrapper">
        <button class="tnnc-aside-button" @click.prevent="toggleVisible">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      </div>
    </aside>
    <main>
      <slot name="main"></slot>
    </main>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { ref, type Ref } from 'vue';

const props = defineProps<{
  closeOnOutsideClick?: boolean;
  visibleStateDefault?: boolean;
}>();
const menuVisible: Ref<boolean> = ref(props.visibleStateDefault || true);
const aside = ref(null);

if (props.closeOnOutsideClick) {
  onClickOutside(aside, () => {
    menuVisible.value = false;
    sideContentVisible.value = false;
  });
}
const sideContentVisible: Ref<boolean> = ref(props.visibleStateDefault || true);
function toggleVisible(e: MouseEvent) {
  e.preventDefault();
  if (menuVisible.value) {
    menuVisible.value = false;
    sideContentVisible.value = false;
  } else {
    menuVisible.value = true;
    setTimeout(() => {
      sideContentVisible.value = true;
    }, 200);
  }
}
</script>
<style>
.tnnc-container {
  margin: 0;
}
.tnnc-default-layout {
  display: flex;
  width: 100%;
}
.tnnc-default-layout aside {
  width: 0px;
  background: var(--color-white-contrast);
  padding: 0;
  min-height: 100vh;
  z-index: 500;
  transition: width 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
}
.tnnc-default-layout main {
  flex: 1;
  overflow: hidden;
  padding: 0 30px;
  min-height: 100vh;
}
.tnnc-aside-button {
  position: fixed;
  background: none;
  border: none;
  top:50%;
  background: var(--color-white-contrast);
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: all 0.2s;
  z-index: -1;
}
.tnnc-aside-button i {
  font-size: 16px;
  padding: 10px 3px;
  transform: rotateY(180deg);
  transition: all 0.2s;
}
.tnnc-aside-button:hover {
  box-shadow: 1px 0 2px #aeaeae;
}
.tnnc-aside-button-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
}
.tnnc-aside-visible .tnnc-aside-button i {
  transform: rotateY(0);
}

aside.tnnc-aside-visible {
  width: 300px;
  padding: 0 25px 25px;
  border-radius: 10px;
}
.tnnc-aside-content {
  overflow: hidden;
}
.tnnc-aside-content.tnnc-aside-content-visible {
  overflow: visible;
  position: fixed;
  top: 20px;
  width: 260px;
}
</style>
