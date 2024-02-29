<template>
  <div
    class="tnnc-label"
    :class="[type, cssClass, { round: isRound }]"
    @click="emitClick"
  >
    {{ text }}
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  text?: string;
  type: "default" | "success" | "danger" | "warning";
  cssClass?: string;
}>();
const emit = defineEmits<{ (e: "onClick"): void }>();

const isRound = computed(() => !props.text || props.text.length === 0);

function emitClick() {
  emit("onClick");
}
</script>
<style>
.tnnc-label {
  font-size: 12px;
  line-height: 15px;
  padding: 4px 10px;
  border-radius: 10px;
  color: white;
  width: fit-content;
  transition: all 0.2s;
  cursor: pointer;
}
.tnnc-label.round {
  border-radius: 50%;
  height: 16px;
  width: 16px;
  padding: 0;
}
.tnnc-label.default {
  background: #c3cdd5;
  color: black;
}
.tnnc-label.success {
  background: #1bb6ac;
}
.tnnc-label.danger {
  background: #fd4e5d;
}
.tnnc-label.warning {
  background: #ef7f17;
}
</style>
