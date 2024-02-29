<template>
  <div
    ref="dropDownSelector"
    class="tnnc-drop-down-selector"
    :class="{ 'tnnc-drop-down-icon-only': iconsOnly }"
  >
    <div
      class="tnnc-drop-down-item"
      :title="computedValueObject?.name"
      @click="setListVisible"
    >
      <i class="tnnc-drop-down-icon" :class="computedValueObject?.icon"></i>
      <div class="tnnc-drop-down-text">
        {{ computedValueObject?.name }}
      </div>
    </div>
    <div
      v-if="listVisible"
      class="tnnc-drop-down-list"
      :style="styleString"
      ref="list"
    >
      <div
        v-for="option in computedOptions"
        class="tnnc-drop-down-item"
        :title="option.name"
        @click="setValue(option.value)"
      >
        <i class="tnnc-drop-down-icon" :class="option.icon"></i>
        <div class="tnnc-drop-down-text">
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { computed, ref } from 'vue';

const props = defineProps<{
  value: string;
  options: {
    name: string;
    value: string;
    icon: string;
  }[];
  iconsOnly?: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:value', data: string): void;
}>();
const computedValueObject = computed(() => {
  const { value, options } = props;
  return options.find((option) => option.value === value);
});
const computedOptions = computed(() => {
  return props.options.filter((option) => option.value !== props.value);
});
const dropDownSelector = ref(null);

const listVisible = ref(false);
const list = ref(null);
function setValue(newValue: string) {
  emit('update:value', newValue);
  listVisible.value = false;
}
onClickOutside(list, () => {
  listVisible.value = false;
});
function setListVisible() {
  setStyleString();
  listVisible.value = true;
}
const styleString = ref('');
function setStyleString() {
  if (dropDownSelector.value) {
    const target = dropDownSelector.value as HTMLElement;
    const { top, left } = target.getBoundingClientRect();
    styleString.value = `top: ${top+20}px; left: ${left}px;`;
  }
}
</script>
<style>
.tnnc-drop-down-selector {
  padding: 3px;
}
.tnnc-drop-down-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
.tnnc-drop-down-icon-only .tnnc-drop-down-text {
  display: none;
}
.tnnc-drop-down-item:hover {
  color: var(--tnnc-color-blue);
}
.tnnc-drop-down-list {
  z-index: 9999;
  position: fixed;
  background: white;
  padding: 3px;
  box-shadow: 2px 2px 2px #aeaeae;
  border-radius: 3px;
}
</style>
