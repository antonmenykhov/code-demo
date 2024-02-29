<template>
  <TextInput
    :value="computedValue"
    :label="label"
    :css-class="cssClass"
    :placeholder="requiredFormat"
    :disabled="disabled"
    :show-clear-button="showClearButton"
    :invalid="computedInvalid || invalid"
    :invalid-text="`${invalidText || ''} ${
      computedInvalid ? invalidMessage : ''
    }`"
    :mask="computedMask"
    @click="emitClick"
    @submited="emitSubmit"
    @cleared="emitCleared"
    @update:value="validateValueAndSet"
  >
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <template #suffix>
      <slot name="suffix"></slot>
      <DateTimePicker
        :value="value"
        :disabled="disabled"
        :with-time="withTime"
        :min-value="minValue"
        :max-value="maxValue"
        @update-value="updateValueFromDatePicker"
      />
    </template>
  </TextInput>
</template>
<script lang="ts" setup>
import { useDateFormat } from '@vueuse/shared';
import { computed, ref } from 'vue';
import TextInput from './TextInput.vue';
import DateTimePicker from './secondary-components/DateTimePicker.vue';
import {
  maskitoDateOptionsGenerator,
  maskitoDateTimeOptionsGenerator,
} from '@maskito/kit';
import type { MaskitoOptions } from '@maskito/core';

const props = defineProps<{
  value: string | null;
  label?: string;
  cssClass?: string;
  disabled?: boolean;
  maxValue?: string;
  minValue?: string;
  withTime?: boolean;
  showClearButton?: boolean;
  invalid?: boolean;
  invalidText?: string;
  mask?: MaskitoOptions;
}>();

const computedMask = computed(() => {
  return props.mask || props.withTime
    ? maskitoDateTimeOptionsGenerator({
        dateMode: 'dd/mm/yyyy',
        timeMode: 'HH:MM:SS',
      })
    : maskitoDateOptionsGenerator({ mode: 'dd/mm/yyyy' });
});

const emit = defineEmits<{
  (e: 'update:value', data: string | null): void;
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
  emit('update:value', null);
  emit('cleared');
}
async function setValue(e: Event) {
  const target = e.target as HTMLInputElement;
  const result = validateValueAndSet(target.value) as string | null;
  if (result !== null) {
    validateMinMaxAndSetValue(result);
  }
  userInputValue.value = '';
  invalidInput.value = false;
}

const validateValueAndSet = (data: string | number) => {
  if (`${data}`.length === 0 || data === null || data === undefined) {
    emit('update:value', null);
    userInputValue.value = '';
    invalidInput.value = false;
  }
  userInputValue.value = `${data}`;
  const calcedValue = props.withTime
    ? calcDateTimeValue(userInputValue.value)
    : calcDateValue(userInputValue.value);

  if (calcedValue !== null) {
    invalidInput.value = false;
  } else {
    invalidInput.value = true;
  }
  if (calcedValue) validateMinMaxAndSetValue(calcedValue);
  return calcedValue;
};

function calcDateTimeValue(dateString: string) {
  try {
    if (dateString.length === 0) return '';
    const [date, time] = dateString.split(', ');
    const [day, month, year] = date.split('.');
    const [hours, minutes, seconds] = time.split(':');
    return JSON.parse(
      JSON.stringify(
        new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`),
      ),
    );
  } catch {
    return null;
  }
}

function calcDateValue(dateString: string) {
  try {
    if (dateString.length === 0) return '';
    const [day, month, year] = dateString.split('.');
    return JSON.parse(
      JSON.stringify(new Date(`${year}-${month}-${day}T00:00:00Z`)),
    );
  } catch {
    return null;
  }
}

const computedValue = computed(() => {
  if (userInputValue.value) return userInputValue.value;
  if (props.value) {
    const { value } = useDateFormat(
      new Date(props.value),
      props.withTime ? 'DD.MM.YYYY, HH:mm:ss' : 'DD.MM.YYYY',
    );
    return value;
  }
  return '';
});

const requiredFormat = computed(() =>
  props.withTime ? 'ДД.ММ.ГГГГ, ЧЧ:мм:СС' : 'ДД.ММ.ГГГГ',
);

const invalidInput = ref(false);
const invalidMinMaxValue = computed(() => invalidMinMaxText.value.length > 0);
const computedInvalid = computed(
  () => invalidInput.value || invalidMinMaxValue.value,
);
const invalidMessage = computed(() =>
  invalidMinMaxText.value.length
    ? invalidMinMaxText.value
    : `Неверный формат. Укажите в виде ${requiredFormat.value}`,
);
const userInputValue = ref('');

const invalidMinMaxText = computed(() => {
  if (props.minValue && props.value) {
    const minValue = new Date(props.minValue).getTime();
    const newValue = new Date(props.value).getTime();
    const { value } = useDateFormat(
      new Date(props.minValue),
      props.withTime ? 'DD.MM.YYYY HH:mm:ss' : 'DD.MM.YYYY',
    );
    if (newValue < minValue) {
      return `Значение вне диапазона, минимальное значение: ${value}`;
    }
  }
  if (props.maxValue && props.value) {
    const maxValue = new Date(props.maxValue).getTime();
    const newValue = new Date(props.value).getTime();
    const { value } = useDateFormat(
      new Date(props.maxValue),
      props.withTime ? 'DD.MM.YYYY HH:mm:ss' : 'DD.MM.YYYY',
    );
    if (newValue > maxValue) {
      return `Значение вне диапазона, максимальное значение: ${value}`;
    }
  }
  return '';
});

function updateValueFromDatePicker(data: string) {
  validateMinMaxAndSetValue(data);
}
function validateMinMaxAndSetValue(data: string) {
  if (data !== props.value) {
    emit('update:value', data);
  }
}
</script>
<style>
.tnnc-blue {
  color: var(--tnnc-color-blue);
}
</style>
