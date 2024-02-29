<template>
  <div class="tnnc-paginator" ref="paginator">
    <button class="tnnc-pag-prev" :disabled="value === 1" @click.prevent="decrement">
      <i></i>
    </button>
    <input
      v-if="inputMode"
      ref="input"
      class="tnnc-paginator-input"
      type="number"
      :min="1"
      :max="maxValue"
      :value="currentValue"
      @keypress.enter="submitValue"
    />
    <Counter
      v-else
      :current-value="currentValue"
      :max-value="maxValue"
      @click="initInput"
    />

    <button
      class="tnnc-pag-next"
      :disabled="value === maxValue"
      @click.prevent="increment"
    >
      <i></i>
    </button>
  </div>
</template>
<script lang="ts" setup>
import { useVModel, onClickOutside } from '@vueuse/core';
import { nextTick, ref } from 'vue';
import Counter from './Counter.vue';

const props = defineProps<{
  value: number;
  maxValue: number;
  cssClass?: string;
}>();
const emit = defineEmits<{ (e: 'update:value', data: number): void }>();
const currentValue = useVModel(props, 'value', emit);
const inputMode = ref(false);
const paginator = ref(null);
const input = ref(null);
function decrement() {
  if (currentValue.value !== 1) {
    currentValue.value -= 1;
  }
}
function increment() {
  if (currentValue.value < props.maxValue) {
    currentValue.value += 1;
  }
}
function submitValue(e: Event) {
  const target = e.target as HTMLInputElement;
  let newValue = target.valueAsNumber;
  if (newValue === null || newValue === undefined || Number.isNaN(newValue))
    return;
  if (newValue < 1) newValue = 1;
  if (newValue > props.maxValue) newValue = props.maxValue;
  currentValue.value = newValue;
  inputMode.value = false;
}
function initInput() {
  inputMode.value = true;
  nextTick(() => {
    if (input.value) {
      (input.value as HTMLElement).focus();
    }
  });
}
onClickOutside(paginator, () => {
  inputMode.value = false;
});
</script>
<style>
.tnnc-paginator {
  background: var(--tnnc-color-orange);
  box-shadow: 0px 10px 26px rgba(233, 227, 10, 0.47);
  border-radius: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: fit-content;
  padding: 10px;
  position: relative;
}
.tnnc-paginator .tnnc-counter {
  font-size: 16px;
  z-index: 2;
}
.tnnc-paginator button {
  height: 24px;
  width: 24px;
  border: none;
  padding: 4px;
  background: transparent;
  cursor: pointer;
  position: static;
}
.tnnc-paginator button i {
  transition: all 0.2s;
  display: block;
  height: 100%;
  width: 100%;
  background: url('../assets/images/pag-arrow-right.svg') no-repeat center
    center / contain;
}
.tnnc-paginator button.tnnc-pag-prev i {
  background: url('../assets/images/pag-arrow-left.svg') no-repeat center center /
    contain;
}
.tnnc-pag-prev::before,
.tnnc-pag-next::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60%;
  border-radius: 22px 0 0 22px;
  transition: all 0.2s;
  background: linear-gradient(90deg, #fff800, var(--tnnc-color-orange));
  box-shadow: 0px 12px 30px rgba(255, 248, 0, 0.5);
  opacity: 0;
}

.tnnc-pag-next::before {
  background: linear-gradient(90deg, var(--tnnc-color-orange), #fff800);
  left: 40%;
  border-radius: 0 22px 22px 0;
}
.tnnc-pag-prev:hover::before,
.tnnc-pag-next:hover::before {
  opacity: 1;
}
.tnnc-paginator button:disabled i {
  opacity: 0.5;
  cursor: not-allowed;
}
.tnnc-paginator button:disabled:hover::before {
  opacity: 0;
}
.tnnc-paginator-input {
  background: rgba(255, 255, 255, 0.719);
  border: none;
  outline: none;
  z-index: 2;
  width: 40px;
  text-align: center;
  font-size: 14px;
  padding: 3px 5px;
  border-radius: 5px;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.tnnc-paginator-input::-webkit-outer-spin-button,
.tnnc-paginator-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
