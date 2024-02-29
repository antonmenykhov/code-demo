<template>
  <div
    ref="button"
    class="tnnc-drop-down-button"
    :class="[
      cssClass,
      optionsPositionVertical,
      { opened: dropDownListVisible },
    ]"
  >
    <ButtonComponent
      css-class="tnnc-drop-down-button-element"
      :icon-class="icon"
      :text="text"
      :disabled="disabled"
      @click="toggleVisible"
    />
    <div
      ref="list"
      class="tnnc-drop-down-button-list"
      :class="[
        listCssClass,
        optionsPositionVertical,
        optionsPositionHorizontal,
        { opened: dropDownListVisible },
      ]"
      :style="listStyleString"
    >
      <slot v-if="contentVisible"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  onClickOutside,
  useElementBounding,
  useWindowSize,
} from '@vueuse/core';
import { computed, nextTick, ref } from 'vue';
import ButtonComponent from './ButtonComponent.vue';

const props = defineProps<{
  icon?: string;
  text?: string;
  disabled?: boolean;
  cssClass?: string;
  listCssClass?: string;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();
const list = ref(null);
const dropDownListVisible = ref(false);
const button = ref(null);
const { width: listWidth } = useElementBounding(list);
const { bottom, left, width, y, height } = useElementBounding(button);
const { height: windowHeight, width: windowWidth } = useWindowSize();
const optionsPositionVertical = computed(() => {
  return bottom.value > windowHeight.value / 2 ? 'top' : 'bottom';
});
const optionsPositionHorizontal = computed(() => {
  return left.value + listWidth.value >= windowWidth.value ? 'right' : 'left';
});

const listStyleString = computed(() => {
  let styleString = `width: ${width.value}px; `;
  if (optionsPositionHorizontal.value === 'right') {
    styleString += `left: ${left.value - (listWidth.value - width.value)}px; `;
  } else {
    styleString += `left: ${left.value}px; `;
  }
  if (optionsPositionVertical.value === 'top') {
    styleString += `bottom: ${
      windowHeight.value - y.value
    }px; border-radius: 10px 10px 0 0;  box-shadow: 0px -4px 5px var(--tnnc-add-color-gray-4);`;
  }
  if (optionsPositionVertical.value === 'bottom') {
    styleString += `top: ${
      y.value + height.value
    }px; border-radius: 0 0 10px 10px;  box-shadow: 0 4px 5px var(--tnnc-add-color-gray-4);`;
  }
  return styleString;
});
const contentVisible = ref(false);
let timeout = 0;
function toggleVisible() {
  clearTimeout(timeout);
  if (dropDownListVisible.value) {
    dropDownListVisible.value = false;
    timeout = setTimeout(() => {
      contentVisible.value = false;
    }, 400);
    emit('close');
  } else {
    contentVisible.value = true;
    nextTick(() => {
      dropDownListVisible.value = true;
    });
  }
}
onClickOutside(button, (e) => {
  if (!dropDownListVisible.value) return;
  const target = e.target as HTMLElement;
  if (target.closest(`.tnnc-drop-down-button-list`)) {
    return;
  }
  if (target.closest(`.tnnc-select-option-wrapper`)) {
    return;
  }
  toggleVisible();
});
</script>

<style>
.tnnc-drop-down-button {
  width: fit-content;
}
.tnnc-drop-down-button-list {
  position: fixed;
  z-index: 99999;
  background: white;
  padding: 5px 10px;
  overflow-x: hidden;
  overflow-y: auto;
  transition: transform 0.4s, opacity 0.4s;
  opacity: 0;
  max-height: 40vh;
}
.tnnc-drop-down-button-list.top {
  transform: scaleY(0) translateY(150%);
}
.tnnc-drop-down-button-list.bottom {
  transform: scaleY(0) translateY(-100%);
}
.tnnc-drop-down-button-list.opened {
  transform: scaleY(1) translateY(0);
  opacity: 1;
}
.tnnc-drop-down-button-list.top.right {
  border-bottom-left-radius: 10px !important;
}
.tnnc-drop-down-button-list.bottom.right {
  border-top-left-radius: 10px !important;
}
.tnnc-drop-down-button {
  transition: all 0.4s;
}
.tnnc-drop-down-button.opened {
  background: white;
}
.tnnc-drop-down-button.opened.top {
  border-radius: 0 0 10px 10px;
}
.tnnc-drop-down-button.opened.bottom {
  border-radius: 10px 10px 0 0;
}
.tnnc-drop-down-button.opened .tnnc-drop-down-button-element:first-child {
  background: transparent;
  box-shadow: none;
}
</style>
