<template>
  <TextInput
    v-model:value="internalVelue"
    :label="label"
    :css-class="cssClass"
    :placeholder="placeholder || 'Введите число'"
    :disabled="disabled"
    :show-clear-button="showClearButton"
    :invalid="invalid"
    :invalid-text="invalidText"
    :mask="mask"
    @click="emitClick"
    @submited="emitSubmit"
    @cleared="emitCleared"
    @update:value="setValue"
    @blur="setFinsihValue"
  >
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <template #suffix>
      <slot name="suffix"></slot>
    </template>
  </TextInput>
</template>
<script lang="ts" setup>
import TextInput from './TextInput.vue';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import type { MaskitoOptions } from '@maskito/core';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    value: number | null;
    label?: string;
    cssClass?: string;
    placeholder?: string;
    disabled?: boolean;
    showClearButton?: boolean;
    invalid?: boolean;
    invalidText?: string;
    mask?: MaskitoOptions;
    maskedToRealTransformer?: (value: string) => number;
  }>(),
  {
    mask: () =>
      maskitoNumberOptionsGenerator({
        precision: 10,
        thousandSeparator: '',
        min: -9007199254740991,
        max: 9007199254740991,
      }),
  },
);

const emit = defineEmits<{
  (e: 'update:value', data: number | null): void;
  (e: 'submited', data: Event): void;
  (e: 'click', data: MouseEvent): void;
  (e: 'cleared'): void;
}>();
function emitClick(e: MouseEvent) {
  emit('click', e);
}
function emitSubmit(e: Event) {
  emit('submited', e);
}
function emitCleared() {
  emit('cleared');
}
function getNumericValue(value: string | number): number | null {
  if (value === '') return null;
  if (props.maskedToRealTransformer)
    return props.maskedToRealTransformer(
      `${value}`.replace('−', '-').replaceAll(' ', ''),
    );
  if (!isNaN(+`${value}`.replace('−', '-').replaceAll(' ', '')))
    return +`${value}`.replace('−', '-').replaceAll(' ', '');
  return props.value;
}
function setValue(e: string | number) {
  if (e !== '-' && e !== '−' && getNumericValue(e) !== props.value)
    emit('update:value', getNumericValue(e));
}
function setFinsihValue(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.value === '-') emit('update:value', null);
}
const internalVelue = ref(props.value || '');
const valueForWatching = computed(() => props.value);
watch(valueForWatching, (newVal) => {
  if (newVal !== getNumericValue(`${internalVelue.value}`))
    internalVelue.value = `${newVal || ''}`;
});
</script>
<style>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'],
input[type='number']:hover,
input[type='number']:focus {
  appearance: none;
  -moz-appearance: textfield;
}
</style>
