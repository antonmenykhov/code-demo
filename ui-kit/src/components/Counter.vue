<template>
  <div class="tnnc-counter" :class="[{ invalid: isInvalid }, cssClass]">
    {{ currentValue }}<template v-if="maxValue">/{{ maxValue }} </template>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  currentValue: number;
  maxValue?: number;
  cssClass?: string;
}>();
const isInvalid = computed(() =>
  props.maxValue ? props.currentValue > props.maxValue : false
);
</script>
<style>
.tnnc-counter {
  font-size: 14px;
  color: var(--tnnc-color-black);
  transition: all 0.2s;
}
.tnnc-counter.invalid {
  color: var(--tnnc-color-red) !important;
}
</style>
