<template>
  <div
    class="tnnc-calendar-day"
    :class="{
      'tnnc-calendar-day-prev': prevNext,
      'tnnc-calendar-day-selected': selected,
      'tnnc-calendar-day-disabled': disabled,
    }"
    @click="setDate"
  >
    {{ date.getDate() }}
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  date: Date;
  prevNext: boolean;
  selected: boolean;
  maxValue?: string;
  minValue?: string;
}>();
const emit = defineEmits<{
  (e: 'setDate', date: Date): void;
}>();
function setDate() {
  emit('setDate', props.date);
}

const disabled = computed(() => {
  const { minValue, maxValue, date } = props;
  if (maxValue) {
    const valueTime = new Date(date).getTime();
    const maxTimeDate = new Date(maxValue);
    maxTimeDate.setHours(0);
    maxTimeDate.setMinutes(0);
    maxTimeDate.setSeconds(0);
    maxTimeDate.setMilliseconds(0);
    const maxTime = maxTimeDate.getTime();
    if (maxTime < valueTime) return true;
  }
  if (minValue) {
    const valueTime = new Date(date).getTime();
    const minTimeDate = new Date(minValue);
    minTimeDate.setHours(0);
    minTimeDate.setMinutes(0);
    minTimeDate.setSeconds(0);
    minTimeDate.setMilliseconds(0);
    const minTime = minTimeDate.getTime();
    if (minTime > valueTime) return true;
  }
  return false;
});
</script>
<style>
.tnnc-calendar-day {
  padding: 3px;
  text-align: center;
  cursor: pointer;
  position: relative;
}
.tnnc-calendar-day::before {
  position: absolute;
  left: 7px;
  top: -1px;
  background: var(--tnnc-color-gray-standart);
  content: '';
  aspect-ratio: 1/1;
  border-radius: 50%;
  width: calc(100% - 14px);
  opacity: 0;
  z-index: -1;
}
.tnnc-calendar-day:hover.tnnc-calendar-day::before {
  opacity: 1;
}
.tnnc-calendar-day-prev {
  color: #969696;
}
.tnnc-calendar-day-selected.tnnc-calendar-day::before {
  opacity: 1;
  background: var(--tnnc-color-gray-standart);
}
.tnnc-calendar-day-disabled.tnnc-calendar-day::after {
  content: '+';
  transform: rotate(45deg);
  color: #969696;
  position: absolute;
  left: 12px;
  font-weight: 100;
  top: -8px;
  opacity: 0.9;
  font-size: 36px;
  display: flex;
  z-index: -1;
}
.tnnc-calendar-day-disabled {
  color: #969696;
}
</style>
