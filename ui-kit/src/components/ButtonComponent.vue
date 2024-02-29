<template>
  <button
    class="tnnc-button"
    :class="[cssClass, type, { 'icon-only': iconOnly, reverse: reverse }]"
    :disabled="disabled"
    @click.prevent="emitClick"
  >
    {{ text }}
    <i v-if="iconClass" class="tnnc-button-icon" :class="iconClass"></i>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text?: string;
  iconClass?: string;
  cssClass?: string;
  disabled?: boolean;
  reverse?: boolean;
  type?: 'default' | 'danger' | 'success';
}>();
const emit = defineEmits<{ (e: 'click'): void }>();
const iconOnly = computed(() => !props.text || props.text.length === 0);

function emitClick(e: MouseEvent) {
  e.preventDefault();
  emit('click');
}
</script>
<style>
.tnnc-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px 10px 26px rgba(233, 227, 10, 0.47);
  padding: 10px 20px;
  border-radius: 22px;
  border: none;
  background: var(--tnnc-color-orange);
  line-height: 24px;
  font-size: 16px;
  color: var(--tnnc-color-black);
  transition: all 0.2s;
  cursor: pointer;
}
.tnnc-button-icon {
  width: 24px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  display: block;
}
.tnnc-button:hover {
  background: #fff800;
  box-shadow: 0px 12px 30px rgba(255, 248, 0, 0.5);
}
.tnnc-button:active {
  background: #e9e30a;
  box-shadow: 0px 10px 26px rgba(233, 227, 10, 0.47);
}

.tnnc-button.icon-only {
  padding: 10px;
  aspect-ratio: 1/1;
}
.tnnc-button.reverse {
  flex-direction: row-reverse;
}
.tnnc-button.danger {
  background: var(--tnnc-color-red);
  box-shadow: 0px 10px 26px rgba(253, 78, 93, 0.47);
  color: white;
}
.tnnc-button.danger:hover {
  background: rgb(255, 19, 39);
  box-shadow: 0px 12px 30px rgba(253, 78, 93, 0.5);
}
.tnnc-button.danger:active {
  background: rgb(204, 9, 25);
  box-shadow: 0px 10px 26px rgba(253, 78, 93, 0.47);
}
.tnnc-button.success {
  background: rgb(27, 182, 172);
  box-shadow: 0px 10px 26px rgba(27, 182, 172, 0.47);
  color: white;
}
.tnnc-button.success:hover {
  background: rgb(17, 209, 196);
  box-shadow: 0px 12px 30px rgba(27, 182, 172, 0.5);
}
.tnnc-button.success:active {
  background: rgb(9, 170, 159);
  box-shadow: 0px 10px 26px rgba(27, 182, 172, 0.47);
}
.tnnc-button:disabled,
.tnnc-button.success:disabled,
.tnnc-button.danger:disabled,
.tnnc-button.disabled:hover,
.tnnc-button.disabled:active {
  box-shadow: none;
  background: var(--tnnc-color-gray-standart);
  color: var(--tnnc-add-color-gray-4);
  cursor: not-allowed;
}
</style>
