<template>
  <div class="tnnc-page-size-selector">
    <div
      v-for="size in pageSizes"
      :key="size"
      class="tnnc-page-size-option"
      @click="setPageSize(size)"
    >
      {{ size }}
    </div>
    <div
      class="tnnc-page-size-option tnnc-current-page-size"
      :style="`transform: translateX(${currentOffset}px)`"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  pageSizes: number[];
  pageSize: number;
}>();
const emit = defineEmits<{ (e: 'update:pageSize', data: number): void }>();
const currentOffset = computed(
  () => props.pageSizes.findIndex((size) => size === props.pageSize) * 40,
);
function setPageSize(newSize: number) {
  emit('update:pageSize', newSize);
}
</script>
<style>
.tnnc-page-size-selector {
  display: flex;
  align-items: center;
  background: var(--tnnc-color-orange);
  box-shadow: 0px 10px 26px rgba(233, 227, 10, 0.47);
  border-radius: 22px;
  padding: 5px;
  gap: 5px;
}
.tnnc-page-size-option {
  border-radius: 50%;
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  z-index: 2;
}
.tnnc-page-size-option:hover {
  background: rgba(255, 255, 255, 0.452);
}
.tnnc-page-size-option.tnnc-current-page-size {
  background: rgba(255, 255, 255, 0.719);
  position: absolute;
  left: 5px;
  z-index: 1;
}
</style>
