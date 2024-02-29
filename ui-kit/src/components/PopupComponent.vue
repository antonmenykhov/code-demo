<template>
  <div class="pop-up-wrapper">
    <Teleport v-if="visible" to="body">
      <div
        class="tnnc-popup-element-wrapper"
        :class="[cssClass, { 'tnnc-popup-visible': internalVisible }]"
        @click="outsideClick"
      >
        <div class="tnnc-pop-up" :style="`width: ${width}; height: ${height};`">
          <div v-if="showTopBar" class="top-bar">
            <h2>{{ title }}</h2>
            <ButtonComponent
              v-if="allowClose"
              icon-class="fa-solid fa-close"
              @click="close"
            />
          </div>
          <div class="tnnc-popup-content"><slot></slot></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    allowClose?: boolean;
    width?: string;
    height?: string;
    closeOnOutsideClick?: boolean;
    cssClass?: string;
    showTopBar?: boolean;
  }>(),
  {
    title: '',
    allowClose: true,
    width: 'auto',
    height: 'auto',
    showTopBar: true,
  },
);
const emit = defineEmits<{ (e: 'update:visible', data: boolean): void }>();
function close() {
  internalVisible.value = false;
  setTimeout(() => {
    emit('update:visible', false);
  }, 200);
}
const internalVisible = ref(false);
watch(props, (props) => {
  setTimeout(() => {
    internalVisible.value = props.visible;
  }, 10);
});
function outsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (
    props.allowClose &&
    props.closeOnOutsideClick &&
    target.classList.contains('tnnc-popup-element-wrapper')
  ) {
    close();
  }
}
defineExpose({ close });
</script>
<style>
.tnnc-pop-up {
  background: white;
  box-shadow: 0 0 4px #aeaeae;
  display: none;
  z-index: 9998;
  overflow: hidden;
  flex-direction: column;
  border-radius: 5px;
  transition: all 0.2s;
  transform: scale(0);
  display: flex;
  overflow: hidden;
  max-height: 100vh;
  padding: 5px;
}
.tnnc-pop-up .top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e2e2e2;
}
.tnnc-pop-up .top-bar h2 {
  margin: 5px 0;
  font-weight: 400;
}
.tnnc-popup-content {
  padding: 10px;
  overflow: auto;
  flex: 1;
  margin-top: 5px;
}
.tnnc-popup-element-wrapper {
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.692);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
  transition: all 0.2s;
  opacity: 0;
  overflow: hidden;
  padding: 20px;
}
.tnnc-pop-up .top-bar .tnnc-button {
  background: transparent;
  box-shadow: unset;
  padding: 2px;
}
.tnnc-pop-up .top-bar .tnnc-button:hover {
  color: var(--tnnc-color-orange);
}
.tnnc-popup-visible.tnnc-popup-element-wrapper {
  opacity: 1;
}
.tnnc-popup-visible .tnnc-pop-up {
  transform: scale(1);
}
</style>
