<template>
  <div class="tnnc-radio-group" :class="groupCssClass">
    <RadioButton
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
      :group-name="groupName"
      :checked="option.value === value"
      :css-class="`${radioButtonCssClass} ${option.cssClass}`"
      @selection-changed="selectionChanged"
    />
  </div>
</template>
<script lang="ts" setup>
import RadioButton from './RadioButton.vue';

const props = defineProps<{
  options: {
    label: string;
    value: string;
    disabled?: boolean;
    cssClass?: string;
  }[];
  value: string;
  groupName: string;
  groupCssClass?: string;
  radioButtonCssClass?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', data: string): void;
}>();
function selectionChanged(newValue: string) {
  emit('update:value', newValue);
}
</script>
<style>
.tnnc-radio-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
