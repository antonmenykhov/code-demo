<template>
  <div class="tnnc-time-picker">
    <h4>Время</h4>
    <SelectBox
      allow-search
      :options="hours"
      :value="currentHours"
      label="Часы"
      @update:value="setHours"
      option-css-class="tnnc-date-picker-options"
    />
    <SelectBox
      allow-search
      :options="minutesOrSeconds"
      :value="currentMinutes"
      label="Минуты"
      @update:value="setMinutes"
      option-css-class="tnnc-date-picker-options"
    />
    <SelectBox
      allow-search
      :options="minutesOrSeconds"
      :value="currentSeconds"
      label="Секунды"
      @update:value="setSeconds"
      option-css-class="tnnc-date-picker-options"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import SelectBox from '../SelectBox.vue';

const props = defineProps<{
  value: string | null;
}>();
const emit = defineEmits<{
  (e: 'setTime', data: Date): void;
}>();
const currentDate = computed(() =>
  props.value ? new Date(props.value) : new Date(),
);

const currentDay = computed(() => currentDate.value.getDate());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const currentHours = computed(() => currentDate.value.getHours());
const currentMinutes = computed(() => currentDate.value.getMinutes());
const currentSeconds = computed(() => currentDate.value.getSeconds());

function generateNumberArray(finish: number) {
  const arr: number[] = [];
  for (let i = 0; i < finish; i++) {
    arr.push(i);
  }
  return arr;
}
const minutesOrSeconds = generateNumberArray(60);
const hours = generateNumberArray(24);

function setHours(data: number) {
  const newDate = new Date(
    currentYear.value,
    currentMonth.value,
    currentDay.value,
    +data,
    currentMinutes.value,
    currentSeconds.value,
  );
  emit('setTime', newDate);
}
function setMinutes(data: number) {
  const newDate = new Date(
    currentYear.value,
    currentMonth.value,
    currentDay.value,
    currentHours.value,
    +data,
    currentSeconds.value,
  );
  emit('setTime', newDate);
}
function setSeconds(data: number) {
  const newDate = new Date(
    currentYear.value,
    currentMonth.value,
    currentDay.value,
    currentHours.value,
    currentMinutes.value,
    +data,
  );
  emit('setTime', newDate);
}
</script>
<style>
.tnnc-time-picker {
  overflow: hidden;
}
.tnnc-time-picker h4 {
  margin-top: 0;
}
</style>
