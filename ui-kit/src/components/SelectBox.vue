<template>
  <div
    ref="selectbox"
    :id="id"
    class="tnnc-select-box"
    :class="[cssClass, optionsPosition, { opened: opened }]"
  >
    <ButtonComponent v-if="buttonMode" :text="label" @click="toggleOpened" />
    <TextInput
      v-else
      :value="computedValue"
      :label="label"
      :disabled="(!allowSearch && !autocompleteMode) || disabled"
      :placeholder="placeholder"
      :show-clear-button="showClearButton && !disabled"
      :invalid="invalid"
      :invalid-text="invalidText"
      @update:value="setSearchPhrase"
      @click="toggleOpened"
      @cleared="clearValue"
      @submited="selectAllOptions"
      @keydown="preventDeleteOnMultiply"
    >
      <template #suffix>
        <button
          v-show="!disabled"
          class="tnnc-input-button"
          @click.prevent="toggleOpened"
        >
          <i class="tnnc-select-box-button-icon"></i>
        </button>
      </template>
    </TextInput>
    <SelectBoxOptionList
      v-if="rendered"
      ref="optionsList"
      v-model:value="editableValue"
      :options="optionsComputed"
      :display-expr="displayExpr"
      :value-expr="valueExpr"
      :value-type="valueType"
      :parentId="id"
      :options-position="optionsPosition"
      :opened="opened"
      :isMultiply="isMultiply"
      :cssClass="optionCssClass"
      :is-tree="isTree"
      :options-width="optionsWidth"
      @update:value="() => checkMultiplyAndClose"
    />
  </div>
</template>
<script lang="ts" setup>
import useUUID from '@/composables/useUUID';
import {
  useElementBounding,
  useVModel,
  useWindowSize,
  onClickOutside,
  useThrottle,
} from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';
import ButtonComponent from './ButtonComponent.vue';
import SelectBoxOptionList from './secondary-components/SelectBoxOptionList.vue';
import TextInput from './TextInput.vue';

export type Option = {
  [key: string]: OptionValue;
};
export type OptionPrimitive = string | number | Option | boolean | null | any;
export type OptionValue = OptionPrimitive | OptionPrimitive[];

export type ValueType = 'primitive' | 'object';
const props = withDefaults(
  defineProps<{
    value: OptionValue;
    label?: string;
    options: OptionPrimitive[];
    valueType?: ValueType;
    displayExpr?: string;
    valueExpr?: string;
    cssClass?: string;
    optionCssClass?: string;
    placeholder?: string;
    allowSearch?: boolean;
    showClearButton?: boolean;
    isTree?: boolean;
    buttonMode?: boolean;
    invalid?: boolean;
    invalidText?: string;
    disabled?: boolean;
    optionsWidth?: number;
    autocompleteMode?: boolean;
  }>(),
  { valueType: 'primitive', placeholder: 'Выберите из списка' },
);
const emit = defineEmits<{
  (e: 'update:value', data: OptionValue): void;
  (e: 'cleared'): void;
}>();

const { id } = useUUID();

const isMultiply = computed(() => Array.isArray(props.value));
const editableValue = useVModel(props, 'value', emit);
function clearValue() {
  editableValue.value = isMultiply.value ? [] : null;
  emit('cleared');
}
const plainOptionList = computed(() => {
  const { options, isTree } = props;
  if (isTree) {
    const newOptions: OptionPrimitive[] = [];
    function insertOptions(option: OptionPrimitive) {
      newOptions.push(option);
      if (option.child && option.child.length) {
        option.child.forEach(insertOptions);
      }
    }
    options.forEach(insertOptions);
    return newOptions;
  }
  return options;
});
const computedValue = computed(() => {
  const { valueType, value, valueExpr, displayExpr } = props;
  if (props.autocompleteMode) return value;
  //if (searchPhrase.value !== '_null_') return searchPhrase.value;
  if (Array.isArray(value)) {
    return [
      ...value.map((primitiveValue) =>
        getValue(
          valueType,
          primitiveValue,
          plainOptionList.value,
          valueExpr,
          displayExpr,
        ),
      ),
      searchPhrase.value,
    ]
      .filter((val) => val !== '_null_')
      .join(', ');
  } else {
    return getValue(
      valueType,
      value,
      plainOptionList.value,
      valueExpr,
      displayExpr,
    );
  }
});
function getValue(
  valueType: ValueType,
  value: OptionPrimitive,
  options: OptionPrimitive[],
  valueExpr?: string,
  displayExpr?: string,
) {
  if (valueType === 'primitive') {
    return getPrimitiveValue(value, options, valueExpr, displayExpr);
  }
  return getObjectValue(value, valueExpr, displayExpr);
}
function getPrimitiveValue(
  value: OptionPrimitive,
  options: OptionPrimitive[],
  valueExpr?: string,
  displayExpr?: string,
) {
  if (value === null || value === undefined) return '';
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    if (displayExpr && valueExpr) {
      const currentOption = options.find((option) =>
        typeof option !== 'number' &&
        typeof option !== 'string' &&
        option !== null &&
        typeof option !== 'boolean'
          ? option[valueExpr] === value
          : false,
      );
      return currentOption &&
        typeof currentOption !== 'number' &&
        typeof currentOption !== 'string' &&
        currentOption !== null &&
        typeof currentOption !== 'boolean'
        ? `${currentOption[displayExpr]}`
        : '';
    } else {
      return `${value}`;
    }
  }
  throw 'Set prop valueType to "object"';
}
function getObjectValue(
  value: OptionPrimitive,
  valueExpr?: string,
  displayExpr?: string,
) {
  if (!value) {
    return '';
  }
  if (
    displayExpr &&
    valueExpr &&
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean'
  ) {
    return `${value[displayExpr]}`;
  }
  throw 'Set displayExpr & valueExpr"';
}

const selectbox = ref(null);
const { bottom } = useElementBounding(selectbox);
const { height: windowHeight } = useWindowSize();
const opened = ref(false);
const rendered = ref(false);
function toggleOpened() {
  if (!props.disabled) {
    if (rendered.value) {
      closeOptions(isMultiply.value);
    } else {
      openOptions();
    }
  }
}
function openOptions() {
  rendered.value = true;
  setTimeout(() => {
    opened.value = true;
  }, 0);
  if (
    isMultiply.value &&
    searchPhrase.value === '_null_' &&
    `${props.value}`.length > 1
  ) {
    searchPhrase.value = ' ';
  }
}
function closeOptions(clearSearchPhrase = false) {
  opened.value = false;
  setTimeout(() => {
    rendered.value = false;
  }, 300);
  if (clearSearchPhrase) searchPhrase.value = '';
}
const optionsPosition = computed(() => {
  return bottom.value > windowHeight.value / 2 ? 'top' : 'bottom';
});
onClickOutside(selectbox, (e) => {
  setTimeout(() => {
    const target = e.target as HTMLElement;
    if (
      rendered.value &&
      (!isMultiply.value ||
        (isMultiply.value && !target.closest(`.tnnc-select-option-wrapper`))) &&
      (!props.isTree ||
        (props.isTree && !target.closest(`.tnnc-select-option-wrapper`)))
    ) {
      closeOptions(true);
    }
  }, 1);
});

const searchPhrase: Ref<string | number> = ref('_null_');
const throttledSearchPhrase = useThrottle(searchPhrase, 200);
function setSearchPhrase(newValue: string | number) {
  if (props.autocompleteMode) emit('update:value', newValue);
  if (isMultiply.value) {
    const newValueArray = `${newValue}`.split(',');
    if (
      `${newValue}`.lastIndexOf(',') === `${newValue}`.length - 1 ||
      newValueArray[newValueArray.length - 1] ===
        newValueArray[newValueArray.length - 2]
    ) {
      return (searchPhrase.value = '_null_');
    }
    searchPhrase.value = newValueArray[newValueArray.length - 1].trim();
  } else {
    searchPhrase.value = newValue;
  }
  if (!rendered.value) toggleOpened();
}
function preventDeleteOnMultiply(e: KeyboardEvent) {
  //console.log(e);
  if (isMultiply.value) {
    const target = e.target as HTMLInputElement;
    if (
      (target.selectionEnd || 0) <
        computedValue.value.length - `${searchPhrase.value}`.length + 1 &&
      (e.key === 'Backspace' || e.key === 'Delete')
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
const optionsComputed = computed(() => {
  if (throttledSearchPhrase.value === '_null_' || throttledSearchPhrase.value === ' ')
    return props.options;
  const searchItem = `${throttledSearchPhrase.value}`.toLowerCase();
  return props.options.filter((option) =>
    `${
      props.displayExpr &&
      typeof option !== 'number' &&
      typeof option !== 'string' &&
      option !== null &&
      typeof option !== 'boolean'
        ? option[props.displayExpr]
        : option
    }`
      .toLowerCase()
      .includes(searchItem),
  );
});
function checkMultiplyAndClose() {
  if (!isMultiply.value) closeOptions(true);
}
const optionsList: Ref<any> = ref(null);
function selectAllOptions() {
  if (optionsList.value && isMultiply.value) optionsList.value.toggleAll();
}
</script>
<style>
.tnnc-select-box {
  transition: all 0.4s;
  position: relative;
}
.tnnc-select-box.opened {
  background: white;
}
.tnnc-select-box.opened.top {
  border-radius: 0 0 10px 10px;
}
.tnnc-select-box.opened.bottom {
  border-radius: 10px 10px 0 0;
}
.tnnc-select-box.opened .tnnc-input-labeled input,
.tnnc-select-box.opened .tnnc-input-labeled label {
  padding-left: 10px !important;
  border-color: transparent;
}
.tnnc-select-box-button-icon {
  background: url('../assets/images/pag-arrow-right.svg') no-repeat center
    center / contain;
  height: 13px;
  width: 13px;
  transform: rotateZ(90deg);
  transition: all 0.4s;
}

.tnnc-select-box.opened .tnnc-select-box-button-icon {
  transform: rotateZ(90deg) rotateY(180deg);
}
.tnnc-select-box.opened .tnnc-button {
  background: transparent;
  box-shadow: none;
}
</style>
