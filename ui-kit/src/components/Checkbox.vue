<template>
  <div class="tnnc-check-box" :class="cssClass">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      type="checkbox"
      :id="id"
      :checked="value"
      :disabled="disabled"
      @click="value = !value"
    />
  </div>
</template>
<script lang="ts" setup>
import useUUID from '@/composables/useUUID';
import { useVModel } from '@vueuse/core';

const { id } = useUUID();
const props = defineProps<{
  value: boolean;
  label?: string;
  cssClass?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:value', data: boolean): void;
}>();
const value = useVModel(props, 'value', emit);
</script>
<style>
.tnnc-check-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tnnc-check-box label {
  font-size: 16px;
  line-height: 18px;
  color: var(--tnnc-color-black);
}
.tnnc-check-box input[type='checkbox'] {
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  width: 30px;
  height: 30px;
  border: 2px solid var(--tnnc-add-color-gray-3);
  border-radius: 8px;
  position: relative;
  transition: all 0.2s;
  outline-offset: 6px;
  outline-color: var(--tnnc-color-blue);
  padding: 0;
  cursor: pointer;
}

.tnnc-check-box input[type='checkbox']:hover {
  border-color: var(--tnnc-color-blue);
}

.tnnc-check-box input[type='checkbox']::before {
  content: '';
  top: -2px;
  left: -2px;
  height: calc(100% + 4px);
  width: calc(100% + 4px);
  position: absolute;
  z-index: -1;
  transform: scale(0);
  will-change: transform;
  background: var(--tnnc-color-blue);
  transition: all 0.2s;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
}
.tnnc-check-box input[type='checkbox']::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  bottom: 3px;
  right: 3px;
  z-index: 2;
  transform: scale(0);
  will-change: transform;
  background: url('../assets/images/check.svg') no-repeat center center /
    contain;
  transition: all 0.2s;
  opacity: 0;
}

.tnnc-check-box input[type='checkbox']:checked {
  border-color: var(--tnnc-color-blue);
}

.tnnc-check-box input[type='checkbox']:checked::before,
.tnnc-check-box input[type='checkbox']:checked::after {
  transform: scale(1);
  opacity: 1;
}

.tnnc-check-box input[type='checkbox']:disabled {
  background: var(--tnnc-add-color-gray-4);
  border-color: var(--tnnc-add-color-gray-4);
  cursor: not-allowed;
}
.tnnc-check-box input[type='checkbox']:disabled::before {
  background: var(--tnnc-add-color-gray-4);
}
</style>
