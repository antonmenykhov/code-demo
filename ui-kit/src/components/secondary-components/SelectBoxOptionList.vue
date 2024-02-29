<template>
  <teleport to="body">
    <div
      class="tnnc-select-option-wrapper"
      :class="[{ opened: opened }, optionsPosition, cssClass]"
      :id="`${parentId}-options`"
      :style="optionStyle"
    >
      <div class="tnnc-select-option-list" v-if="optionsForRender.length">
        <SelectBoxOption
          v-if="isMultiply"
          :show-select-box="isMultiply"
          :option="{
            key: '__select_all__',
            name: 'Выбрать все',
            value: '__select_all__',
          }"
          :selected="isAllSelected"
          :is-tree="isTree"
          :selected-options="selectedOptions"
          @click="toggleAll"
          @child-click="toggleAll"
        />
        <SelectBoxOption
          v-for="option in renderedOptions"
          :key="option.key"
          :show-select-box="isMultiply"
          :selected-options="selectedOptions"
          :option="option"
          :selected="selectedOptions.includes(option.key)"
          :is-tree="isTree"
          @click="setValue"
          @child-click="setValueTree"
        />
        <div ref="bottomBorder" class="intersection"></div>
      </div>
      <div class="tnnc-select-option-empty" v-else>Данных нет</div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { ValueType } from '../SelectBox.vue';
import {
  useElementBounding,
  useIntersectionObserver,
  useWindowSize,
} from '@vueuse/core';
import SelectBoxOption from './SelectBoxOption.vue';
import { isArray } from '@vue/shared';

export type OptionComputed = {
  key: string;
  name: string | number;
  value: OptionPrimitive;
  child?: OptionComputed[];
};

export type Option = {
  [key: string]: OptionValue;
};
export type OptionPrimitive = string | number | Option | boolean | null;
export type OptionValue = OptionPrimitive | OptionPrimitive[];

const props = defineProps<{
  value: OptionValue;
  options: OptionPrimitive[];
  displayExpr?: string;
  valueExpr?: string;
  valueType: ValueType;
  parentId: string;
  opened: boolean;
  optionsPosition: 'top' | 'bottom';
  isMultiply: boolean;
  cssClass?: string;
  isTree?: boolean;
  optionsWidth?: number;
}>();
const emit = defineEmits<{
  (e: 'update:value', data: OptionValue): void;
}>();

function getKey(option: OptionPrimitive): string | number | boolean | null {
  const key =
    props.displayExpr &&
    props.valueExpr &&
    typeof option !== 'number' &&
    typeof option !== 'string' &&
    option !== null &&
    typeof option !== 'boolean'
      ? option[props.valueExpr]
      : option;
  return typeof key === 'object' ? `${key}` : key;
}
function getName(option: OptionPrimitive): string | number {
  return props.displayExpr &&
    props.valueExpr &&
    typeof option !== 'number' &&
    typeof option !== 'string' &&
    option !== null &&
    typeof option !== 'boolean'
    ? `${option[props.displayExpr]}`
    : `${option}`;
}

function getOption(option: OptionPrimitive): OptionComputed {
  const key = getKey(option);
  return {
    key: `${key}`,
    name: getName(option),
    value: props.valueType === 'object' ? option : key,
    child:
      typeof option === 'object' && isArray(option?.['child'])
        ? option?.['child']?.map(getOption)
        : [],
  };
}

const optionsForRender = computed(() => {
  return props.options.map(getOption);
});

const parentElement = document.getElementById(props.parentId);
const { left, width, y, height } = useElementBounding(parentElement);
const { height: windowHeight } = useWindowSize();

const optionStyle = computed(() => {
  const { optionsPosition, optionsWidth } = props;
  const delta = optionsWidth ? width.value - optionsWidth : 0;
  let styleString = `left: ${left.value + delta}px; width: ${
    optionsWidth || width.value
  }px;`;

  if (optionsPosition === 'top') {
    styleString += `bottom: ${
      windowHeight.value - y.value
    }px; border-radius: 10px 10px 0 0;  box-shadow: 0px -4px 5px var(--tnnc-add-color-gray-4);`;
  }
  if (optionsPosition === 'bottom') {
    styleString += `top: ${
      y.value + height.value
    }px; border-radius: 0 0 10px 10px;  box-shadow: 0 4px 5px var(--tnnc-add-color-gray-4);`;
  }
  return styleString;
});

const selectedOptions = computed(() => {
  const { value } = props;
  let selectedKeys = [];
  if (Array.isArray(value)) {
    selectedKeys = value;
  } else {
    selectedKeys = [value];
  }
  return selectedKeys.map((val) => `${getKey(val)}`);
});

function getAllOptions() {
  const newValue = optionsForRender.value.map((option) => option.value);
  if (props.isTree) {
    optionsForRender.value.forEach((option) => {
      option.child?.forEach((childOption) => {
        newValue.push(...getAllChildsRecursive(childOption));
      });
    });
  }
  return newValue;
}

const isAllSelected = computed(() => {
  if (props.isTree) {
    return getAllOptions().length === selectedOptions.value.length;
  }
  return selectedOptions.value.length === optionsForRender.value.length;
});

function getAllChildsRecursive(option: OptionComputed) {
  const childs: OptionPrimitive[] = [];
  childs.push(option.value);
  option.child?.forEach((child) => {
    childs.push(...getAllChildsRecursive(child));
  });
  return childs;
}

function toggleAll() {
  let newValue: OptionPrimitive[] = [];
  if (!isAllSelected.value) {
    newValue = getAllOptions();
  }
  emit('update:value', newValue);
}

function findIndex(item: OptionPrimitive, valueArr: OptionPrimitive[]) {
  return valueArr.findIndex((val) => {
    if (typeof item === 'object' && typeof val === 'object' && props.valueExpr)
      return val?.[props.valueExpr] === item?.[props.valueExpr];
    return val === item;
  });
}

function setValue(newValueItem: OptionPrimitive) {
  const { value, isMultiply } = props;
  if (isMultiply && Array.isArray(value)) {
    let newValue = [...value];
    const existedIndex = findIndex(newValueItem, newValue);
    if (existedIndex !== -1) {
      newValue.splice(existedIndex, 1);
    } else {
      newValue.push(newValueItem);
    }
    emit('update:value', newValue);
  } else {
    emit('update:value', newValueItem);
  }
}

function setValueTree(data: {
  child: OptionPrimitive[];
  parent: OptionPrimitive[];
}) {
  const { value } = props;
  if (Array.isArray(value)) {
    const newValue = [...value];
    const isFirstChildExist = findIndex(data.child[0], newValue) !== -1;
    data.child.forEach((childItem) => {
      const existIndex = findIndex(childItem, newValue);
      if (!isFirstChildExist && existIndex === -1) newValue.push(childItem);
      if (isFirstChildExist && existIndex !== -1)
        newValue.splice(existIndex, 1);
    });
    const parentOptions: OptionComputed[] = [];
    data.parent.reverse().forEach((parentItem, index) => {
      if (index === 0) {
        parentOptions.push(
          optionsForRender.value.find(
            (item) => item.value === parentItem,
          ) as OptionComputed,
        );
      } else {
        parentOptions.push(
          parentOptions[parentOptions.length - 1].child?.find(
            (item) => item.value === parentItem,
          ) as OptionComputed,
        );
      }
    });
    parentOptions.reverse().forEach((parentOption) => {
      let allChildChecked = true;
      const parentIndex = findIndex(parentOption.value, newValue);
      parentOption.child?.forEach((childOption) => {
        allChildChecked =
          allChildChecked && findIndex(childOption.value, newValue) !== -1;
      });
      if (allChildChecked && parentIndex === -1)
        newValue.push(parentOption.value);
      if (!allChildChecked && parentIndex !== -1)
        newValue.splice(parentIndex, 1);
    });
    emit('update:value', newValue);
  } else {
    emit('update:value', data.child[0]);
  }
}

//бесконечный скролл
const renderPostion = ref(0);
const bottomBorder = ref(null);
useIntersectionObserver(
  bottomBorder,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      renderPostion.value += 1;
    }
  },
);
const renderedOptions = computed(() =>
  optionsForRender.value.slice(0, renderPostion.value * 10 + 10),
);
defineExpose({
  toggleAll,
});
</script>
<style>
.tnnc-select-option-wrapper {
  position: fixed;
  z-index: 9999;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  max-height: 40vh;
  transition: transform 0.4s, opacity 0.4s;
  padding: 5px 10px;
}
.tnnc-select-option-wrapper.top {
  transform: scaleY(0) translateY(150%);
}
.tnnc-select-option-wrapper.bottom {
  transform: scaleY(0) translateY(-100%);
}
.tnnc-select-option-wrapper.opened {
  opacity: 1;
  transform: scaleY(1) translateY(0);
}
.tnnc-select-option-list {
  transition-delay: 0.5s;
  transition: all 0.1s;
  flex: 1;
  overflow-x: auto;
  overflow-x: hidden;
}
.tnnc-select-option {
  display: flex;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;
}
.tnnc-select-option.selected {
  color: var(--tnnc-color-blue);
}
.tnnc-select-option:hover {
  color: var(--tnnc-color-blue);
}
.tnnc-select-option-empty {
  color: var(--tnnc-add-color-gray-2);
  font-weight: 300;
  padding: 5px 0;
}
.tnnc-select-option-checkbox.tnnc-check-box input[type='checkbox'] {
  height: 20px;
  width: 20px;
  margin-right: 5px;
  border-radius: 6px;
}
.tnnc-select-option-name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.intersection {
  height: 5px;
  width: 100%;
}
</style>
