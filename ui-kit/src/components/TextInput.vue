<template>
  <div class="tnnc-input-labeled" :class="cssClass">
    <label v-if="label" :for="id">
      {{ label }}
    </label>
    <div class="tnnc-input-container" :class="{ invalid: invalid }">
      <div class="tnnc-input-container-prefix" ref="prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="tnnc-input-wrapper" @click="(e) => emit('click', e)">
        <input
          v-maskito="mask"
          :id="id"
          class="tnnc-text-input"
          type="text"
          :placeholder="placeholder"
          :readonly="disabled"
          @keydown.enter="(e) => emit('submited', e)"
          :style="`padding-left:${preffixWidthComputed}px;
      padding-right:${suffixWidthComputed}px`"
          @blur="(e) => emit('blur', e)"
          :value="value"
          @input="setValue"
          @keydown="emitKeyDown"
        />
      </div>
      <div class="tnnc-input-container-suffix" ref="suffix">
        <button
          v-if="showClearButton"
          class="tnnc-input-button"
          @click.prevent="clearValue"
        >
          <i class="tnnc-clear-icon"></i>
        </button>
        <div
          class="invalid-icon"
          v-if="invalid && invalidText"
          @mouseenter="(e) => (mouseEvent = e)"
          @mouseleave="() => (mouseEvent = null)"
        >
          <i class="fa-solid fa-circle-exclamation"></i>
          <ContextMenu v-if="mouseEvent" :mouse-event="mouseEvent">
            {{ invalidText }}
          </ContextMenu>
        </div>
        <slot name="suffix"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useUUID from '@/composables/useUUID';
import { useElementSize } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';
import ContextMenu from './ContextMenu.vue';
// @ts-ignore
import { maskito as vMaskito } from '@maskito/vue';
import type { MaskitoOptions } from '@maskito/core';

const { id } = useUUID();
const props = withDefaults(
  defineProps<{
    value: string | number | null;
    label?: string;
    cssClass?: string;
    placeholder?: string;
    disabled?: boolean;
    showClearButton?: boolean;
    invalid?: boolean;
    invalidText?: string;
    mask?: MaskitoOptions;
  }>(),
  { placeholder: 'Введите текст', mask: () => ({ mask: /./ }) },
);
const emit = defineEmits<{
  (e: 'update:value', data: string | number): void;
  (e: 'submited', data: Event): void;
  (e: 'blur', data: Event): void;
  (e: 'click', data: MouseEvent): void;
  (e: 'cleared'): void;
  (e: 'keydown', data: KeyboardEvent): void;
}>();

const suffix = ref(null);
const prefix = ref(null);
const { width: suffixWidth } = useElementSize(suffix);
const { width: prefixWidth } = useElementSize(prefix);
const suffixWidthComputed = computed(() =>
  suffixWidth.value > 0 ? suffixWidth.value + 10 : 0,
);
const preffixWidthComputed = computed(() =>
  prefixWidth.value > 0 ? prefixWidth.value + 10 : 0,
);
function clearValue() {
  emit('update:value', '');
  emit('cleared');
}

function setValue(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:value', target.value);
}

const mouseEvent: Ref<null | MouseEvent> = ref(null);

function emitKeyDown(event: KeyboardEvent) {
  emit('keydown', event);
}
</script>
<style>
.tnnc-input-labeled {
  display: flex;
  flex-direction: column;
}
.tnnc-input-labeled label {
  margin-top: 10px;
}
.tnnc-input-labeled input {
  outline: none;
  border: none;
  border-bottom: 2px solid;
  border-color: var(--color-border);
  padding: 8px 0;
  font-size: 16px;
  line-height: 16px;
  color: var(--tnnc-color-black);
  background: transparent;
  transition: all 0.2s;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tnnc-input-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.tnnc-input-labeled:hover input {
  border-color: var(--tnnc-add-color-gray-2);
}

.tnnc-input-labeled input:active,
.tnnc-input-labeled input:focus {
  border-color: var(--tnnc-color-blue);
}
.tnnc-input-labeled input::placeholder {
  color: var(--tnnc-add-color-gray-3);
}
.tnnc-input-labeled input:read-only {
  cursor: default;
  border-color: var(--color-border);
}
.tnnc-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}
.tnnc-input-container-prefix,
.tnnc-input-container-suffix {
  position: absolute;
  left: 0;
  bottom: 2px;
  top: 0;
  display: flex;
  align-items: center;
  z-index: 2;
}
.tnnc-input-container-suffix {
  left: unset;
  right: 0;
}
.tnnc-input-button {
  height: 100%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
}
.tnnc-input-button i {
  font-size: 16px;
}
.tnnc-clear-icon {
  background: url('../assets/images/delete-icon-black.svg') no-repeat center
    center / cover;
  height: 10px;
  width: 10px;
  fill: black;
}
.tnnc-input-container.invalid .tnnc-text-input {
  border-color: var(--tnnc-color-red);
}
.tnnc-input-container .invalid-icon i {
  padding: 0 5px;
  color: var(--tnnc-color-red);
}
</style>
