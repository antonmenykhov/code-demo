<template>
  <div class="tnnc-context-menu-wrapper">
    <Teleport to="body">
      <div
        ref="contextMenu"
        class="tnnc-context-menu"
        :style="contextMenuStyle"
      >
        <slot></slot>
      </div>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside, useEventListener, useWindowSize } from '@vueuse/core';
import { computed, ref } from 'vue';

const props = defineProps<{
  mouseEvent: MouseEvent;
}>();
const emit = defineEmits<{ (e: 'clickOutside', data: MouseEvent): void }>();
const contextMenu = ref(null);
onClickOutside(contextMenu, (e) => {
  emit('clickOutside', e);
});
useEventListener('scroll', () => {
  emit('clickOutside', props.mouseEvent);
});

//стили
const { height: windowHeight, width: windowWidth } = useWindowSize();
const contextMenuStyle = computed(() => {
  const { clientY, clientX } = props.mouseEvent;
  let verticalPostion: 'top' | 'bottom' = 'bottom';
  let horizontalPosition: 'left' | 'right' = 'left';
  let styleString = '';
  if (clientY > windowHeight.value / 2) verticalPostion = 'top';
  if (clientX > windowWidth.value - 300) horizontalPosition = 'right';
  if (verticalPostion === 'top')
    styleString += `bottom: ${
      windowHeight.value - clientY + 5
    }px; border-top-left-radius: 10px;  border-top-right-radius: 10px; `;
  if (verticalPostion === 'bottom')
    styleString += `top: ${
      clientY + 5
    }px; border-bottom-left-radius: 10px;  border-bottom-right-radius: 10px; `;
  if (horizontalPosition === 'left')
    styleString += `left: ${
      clientX + 5
    }px; border-bottom-right-radius: 10px; border-top-right-radius: 10px; `;
  if (horizontalPosition === 'right')
    styleString += `right: ${
      windowWidth.value - clientX
    }px ; border-bottom-left-radius: 10px; border-top-left-radius: 10px; `;
  return styleString;
});
</script>
<style>
.tnnc-context-menu {
  position: fixed;
  background: white;
  padding: 10px;
  z-index: 99991;
  box-shadow: 0 0 5px var(--tnnc-add-color-gray-4);
}
</style>
