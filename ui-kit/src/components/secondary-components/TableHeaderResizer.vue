<template>
  <div ref="resizer" class="tnnc-header-resizer" @mousedown="initResize"></div>
</template>
<script lang="ts" setup>
import { inject, ref } from 'vue';

const props = defineProps<{ width: number; id: string }>();
const startClientX = ref(0);
const width = ref(props.width);
const setColumnWidth = inject('setColumnWidth') as (
  id: string,
  width: number,
) => void;
function initResize(e: MouseEvent) {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  startClientX.value = e.clientX;
}
function onMouseUp() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  setColumnWidth(props.id, width.value);
}
function onMouseMove(e: MouseEvent) {
  requestAnimationFrame(() => {
    const newWidth = width.value + e.clientX - startClientX.value;
    startClientX.value = e.clientX;
    width.value = newWidth;
    setColumnWidth(props.id, width.value);
  });
}
</script>
<style>
.tnnc-table-header-cell .tnnc-header-resizer {
  height: 100%;
  width: 7px;
  right: -4px;
  top: 0;
  cursor: col-resize;
  position: absolute;
  z-index: 5;
  transition: all 0.2s;
}
.tnnc-table-header-cell .tnnc-header-resizer:hover {
  background: rgba(0, 255, 242, 0.247);
}
</style>
