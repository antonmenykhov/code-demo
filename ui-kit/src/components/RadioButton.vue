<template>
  <div class="tnnc-radio-button" :class="[cssClass, { checked: checked }]">
    <label :for="id">{{ label }}</label>
    <input
      type="radio"
      :name="groupName"
      :id="id"
      :checked="checked"
      :disabled="disabled"
      @click="emitSelection"
    />
  </div>
</template>
<script lang="ts" setup>
import useUUID from '@/composables/useUUID';

const { id } = useUUID();
const props = defineProps<{
  value: string;
  label: string;
  checked: boolean;
  groupName: string;
  disabled?: boolean;
  cssClass?: string;
}>();
const emit = defineEmits<{
  (e: 'selectionChanged', data: string): void;
}>();
function emitSelection() {
  emit('selectionChanged', props.value);
}
</script>
<style>
.tnnc-radio-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tnnc-radio-button label {
  font-size: 16px;
  line-height: 18px;
  color: var(--tnnc-color-black);
}
.tnnc-radio-button input[type='radio'] {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 30px;
  height: 30px;
  border: 2px solid var(--tnnc-add-color-gray-3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: transparent;
  cursor: pointer;
}

.tnnc-radio-button input[type='radio']::before {
  content: '';
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: scale(0);
  transition: all 0.2s;
  background: var(--color-white-contrast);
}

.tnnc-radio-button input[type='radio']:checked::before {
  transform: scale(1);
}
.tnnc-radio-button input[type='radio']:checked {
  background: var(--tnnc-color-blue);
  border-color: var(--tnnc-color-blue);
}
.tnnc-radio-button input[type='radio']:hover {
  border-color: var(--tnnc-color-blue);
}
.tnnc-radio-button input[type='radio']:disabled {
  background: var(--tnnc-add-color-gray-4);
  border-color: var(--tnnc-add-color-gray-4);
  cursor: not-allowed;
}
</style>
