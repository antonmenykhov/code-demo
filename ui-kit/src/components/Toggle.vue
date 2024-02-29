<template>
  <div
    class="tnnc-toggle"
    :class="[cssClass, { 'tnnc-vertical-toggle': vertical }]"
  >
    <label v-if="label" :for="id">{{ label }}</label>
    <button
      :id="id"
      :disabled="disabled"
      @click="value = !value"
      :class="{ checked: value }"
    >
      <div class="tip"></div>
    </button>
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
  vertical?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:value', data: boolean): void;
}>();
const value = useVModel(props, 'value', emit);
</script>
<style scoped>
.tnnc-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
}
.tnnc-toggle.tnnc-vertical-toggle {
  flex-direction: column;
  width: 100px;
  margin-top: 5px;
  justify-content: flex-start;
}
.tnnc-toggle.tnnc-vertical-toggle label {
  font-size: 14px;
  color: var(--tnnc-add-color-gray-3);
  transition: all 0.2s;
  flex: unset;
}
.tnnc-toggle label {
  font-size: 16px;
  line-height: 18px;
  color: var(--tnnc-color-black);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tnnc-toggle button {
  background-color: var(--tnnc-add-color-gray-3);
  margin: 0;
  font: inherit;
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 15px;
  position: relative;
  transition: all 0.2s;
  outline-offset: 6px;
  outline-color: var(--tnnc-color-blue);
  padding: 0;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
.tnnc-toggle button.checked {
  background: var(--tnnc-color-blue);
  border-color: var(--tnnc-color-blue);
}

.tnnc-toggle .tip {
  aspect-ratio: 1/1;
  height: 1.6em;
  inset-inline-start: 2px;
  z-index: 2;
  will-change: transform;
  background: var(--color-white-contrast);
  transition: all 0.2s;
  border-radius: 50%;
  content: '';
}

.tnnc-toggle button.checked .tip {
  transform: translateX(20px);
}

.tnnc-toggle button:disabled {
  background: var(--tnnc-add-color-gray-4);
  border-color: var(--tnnc-add-color-gray-4);
  cursor: not-allowed;
}
</style>
