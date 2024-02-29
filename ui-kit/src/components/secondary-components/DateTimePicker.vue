<template>
  <div>
    <button
      ref="button"
      :disabled="disabled"
      class="tnnc-input-button tnnc-date-picker-button"
      @click.prevent="toggleDatePickerShowing"
    >
      <i class="fa-solid fa-calendar-alt tnnc-blue"></i>
    </button>
    <Teleport to="body">
      <div
        v-if="isDatePickerShowed"
        class="tnnc-date-time-picker-wrapper"
        :style="listStyleString"
        ref="datepicker"
      >
        <div class="tnnc-date-picker">
          <div class="tnnc-month-year-picker">
            <SelectBox
              :options="monthNames"
              :value="currentMonthName"
              @update:value="setMonth"
              option-css-class="tnnc-date-picker-options"
            />
            <NumberInput :value="currentYear" @update:value="setYear" />
          </div>
          <div class="tnnc-calendar">
            <div class="tnnc-day-of-week" v-for="day in dayNames" :key="day">
              {{ day }}
            </div>
            <DatePickerDay
              v-for="day in currentCalendar"
              :key="day.getTime()"
              :date="day"
              :prev-next="day.getMonth() !== currentMonth"
              :selected="
                day.getFullYear() === currentYear &&
                day.getMonth() === currentMonth &&
                day.getDate() === currentDay
              "
              :min-value="minValue"
              :max-value="maxValue"
              @set-date="setDate"
            />
          </div>
        </div>
        <TimePicker v-if="withTime" :value="value" @set-time="setTime" />
      </div>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import {
  onClickOutside,
  useElementBounding,
  useWindowSize,
} from '@vueuse/core';
import { computed, ref } from 'vue';
import DatePickerDay from './DatePickerDay.vue';
import SelectBox from '../SelectBox.vue';
import NumberInput from '../NumberInput.vue';
import TimePicker from './TimePicker.vue';

const props = defineProps<{
  value: string | null;
  withTime?: boolean;
  disabled?: boolean;
  maxValue?: string;
  minValue?: string;
}>();

const emit = defineEmits<{
  (e: 'updateValue', data: string): void;
}>();

const button = ref(null);
const { top, left } = useElementBounding(button);
const { height: windowHeight, width: windowWidth } = useWindowSize();
const datepickerWidth = computed(() => (props.withTime ? 500 : 300));
const listStyleString = computed(() => {
  let styleString = `left: ${left.value - datepickerWidth.value}px; top: ${
    windowHeight.value / 2 > top.value ? top.value + 5 : top.value - 205
  }px; width: ${datepickerWidth.value}px;`;

  return styleString;
});
const isDatePickerShowed = ref(false);
const datepicker = ref(null);
function toggleDatePickerShowing() {
  isDatePickerShowed.value = !isDatePickerShowed.value;
  onClickOutside(datepicker, (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.tnnc-date-picker-options'))
      isDatePickerShowed.value = false;
  });
}

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const currentDate = computed(() =>
  props.value ? new Date(props.value) : getCurrentDateWithOpts(),
);
function getCurrentDateWithOpts() {
  const now = props.minValue ? new Date(props.minValue) : new Date();
  if (props.withTime) return now;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
const currentDay = computed(() => currentDate.value.getDate());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 400 === 0 || year % 100 != 0);
}
function daysInMonth(year: number, month: number) {
  const array = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month === 1 && isLeapYear(year) ? 29 : array[month];
}

function getPrevMonthWithYear(year: number, month: number) {
  if (month === 0) return [year - 1, 11];
  return [year, month - 1];
}

function getNextMonthWithYear(year: number, month: number) {
  if (month === 11) return [year + 1, 0];
  return [year, month + 1];
}

function getPrevDays(year: number, month: number) {
  const prevDays: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay() > 0 ? firstDay.getDay() : 7;
  const prevDaysCount = dayOfWeek - 1;
  const [prevYear, prevMonth] = getPrevMonthWithYear(year, month);
  const prevMonthDaysCount = daysInMonth(prevYear, prevMonth);
  for (let i = 0; i < prevDaysCount; i++) {
    prevDays.push(new Date(prevYear, prevMonth, prevMonthDaysCount - i));
  }
  return prevDays.reverse();
}

function getNextDays(year: number, month: number) {
  const nextDays: Date[] = [];
  const firstDay = new Date(year, month, daysInMonth(year, month));
  const dayOfWeek = firstDay.getDay() > 0 ? firstDay.getDay() : 7;
  const nextDaysCount = 7 - dayOfWeek;
  const [nextYear, nextMonth] = getNextMonthWithYear(year, month);
  for (let i = 0; i < nextDaysCount; i++) {
    nextDays.push(new Date(nextYear, nextMonth, i + 1));
  }
  return nextDays;
}

function getCalendar(year: number, month: number) {
  const days: Date[] = [];
  days.push(...getPrevDays(year, month));
  for (let i = 0; i < daysInMonth(year, month); i++) {
    days.push(new Date(year, month, i + 1));
  }
  days.push(...getNextDays(year, month));
  return days;
}

const currentCalendar = computed(() =>
  getCalendar(currentYear.value, currentMonth.value),
);

function setDate(date: Date) {
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    currentDate.value.getHours(),
    currentDate.value.getMinutes(),
    currentDate.value.getSeconds(),
  );
  if (!props.withTime) {
    isDatePickerShowed.value = false;
  }
  emit('updateValue', JSON.parse(JSON.stringify(newDate)));
}

const currentMonthName = computed(() => monthNames[currentMonth.value]);
function setYear(year: number | null) {
  if (year && year > 100 && year <= 9999) {
    const newDate = new Date(
      year,
      currentMonth.value,
      1,
      currentDate.value.getHours(),
      currentDate.value.getMinutes(),
      currentDate.value.getSeconds(),
    );
    emit('updateValue', JSON.parse(JSON.stringify(newDate)));
  }
}
function setMonth(month: string) {
  const monthIndex = monthNames.findIndex((m) => m === month);
  if (monthIndex !== -1) {
    const newDate = new Date(
      currentYear.value,
      monthIndex,
      1,
      currentDate.value.getHours(),
      currentDate.value.getMinutes(),
      currentDate.value.getSeconds(),
    );
    emit('updateValue', JSON.parse(JSON.stringify(newDate)));
  }
}
function setTime(date: Date) {
  const newDate = new Date(
    currentYear.value,
    currentMonth.value,
    currentDay.value,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
  emit('updateValue', JSON.parse(JSON.stringify(newDate)));
}
</script>

<style>
.tnnc-date-time-picker-wrapper {
  position: fixed;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 2px #aeaeae;
  padding: 10px;
  z-index: 9999;
  display: flex;
  gap: 10px;
}
.tnnc-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.tnnc-date-picker {
  max-width: 280px;
}
.tnnc-day-of-week {
  text-align: center;
  padding: 5px 0;
  font-weight: 500;
  background: var(--tnnc-color-gray-light);
  margin-bottom: 5px;
}
.tnnc-month-year-picker {
  display: flex;
  overflow: hidden;
  justify-content: center;
  width: 100%;
  padding-bottom: 5px;
}
.tnnc-month-year-picker > *:first-child {
  width: 50%;
}
.tnnc-month-year-picker > *:last-child {
  width: 50%;
}
.tnnc-month-year-picker .tnnc-input-labeled input {
  padding-left: 10px !important;
}
.tnnc-date-picker-button {
  margin-right: 5px;
}
</style>
