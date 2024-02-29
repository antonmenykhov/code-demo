<template>
  <div
    class="tnnc-input-labeled"
    :class="[cssClass, { hovered: hovered, active: active, invalid: invalid }]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="tnnc-text-area">
      <label v-if="label" :for="id">{{ label }}</label>
      <textarea
        ref="textarea"
        :id="id"
        :rows="rows"
        :placeholder="placeholder"
        v-model="valueVmodel"
        :readonly="disabled"
        @focus="active = true"
        @blur="active = false"
        @keydown="emitKeyDown"
        @input="autosize"
      ></textarea>
      <div
        class="invalid-icon"
        v-if="invalid && invalidText"
        @mouseenter="(e:MouseEvent) => (mouseEvent = e)"
        @mouseleave="() => (mouseEvent = null)"
      >
        <i class="fa-solid fa-circle-exclamation"></i>
        <ContextMenu v-if="mouseEvent" :mouse-event="mouseEvent">
          {{ invalidText }}
        </ContextMenu>
      </div>
    </div>
    <div v-if="showCounter" class="tnnc-text-area-counter">
      <Counter :current-value="valueLength" :max-value="maxLength" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import useUUID from '@/composables/useUUID';
import { useVModel } from '@vueuse/core';
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import Counter from './Counter.vue';
import ContextMenu from './ContextMenu.vue';

const { id } = useUUID();
const props = withDefaults(
  defineProps<{
    value: string | number | null;
    label?: string;
    cssClass?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    showCounter?: boolean;
    invalid?: boolean;
    invalidText?: string;
    disabled?: boolean;
    autosize?: boolean;
  }>(),
  { placeholder: 'Введите текст', rows: 5, showCounter: false },
);
const emit = defineEmits<{
  (e: 'update:value', data: string | number): void;
  (e: 'keydown', data: KeyboardEvent): void;
}>();
const valueVmodel = useVModel(props, 'value', emit) as Ref<string | number>;
const valueLength = computed(() => String(valueVmodel.value).length);
const hovered = ref(false);
const active = ref(false);

const mouseEvent: Ref<null | MouseEvent> = ref(null);
function emitKeyDown(e: KeyboardEvent) {
  emit('keydown', e);
}

const textarea = ref<HTMLTextAreaElement>();

function autosize() {
  if (!textarea.value || !props.autosize) return;
  textarea.value.style.height = 'auto';
  textarea.value.style.height = textarea.value.scrollHeight + 'px';
}

watch(valueVmodel, () => setTimeout(autosize));

onMounted(() => {
  autosize();
});
</script>
<style>
.tnnc-text-area {
  background: #ffffff;
  border-radius: 10px 10px 0px 0px;
  padding-bottom: 10px;
  padding: 10px;
  border-bottom: 2px solid;
  border-color: var(--color-border);
  transition: all 0.2s;
}
.hovered .tnnc-text-area {
  border-color: var(--tnnc-add-color-gray-2);
}
.active .tnnc-text-area {
  border-color: var(--tnnc-color-blue);
}
.tnnc-text-area textarea {
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--tnnc-color-black);
  background: transparent;
  line-height: 22px;
  resize: none;
  margin-top: 10px;
  width: 100% !important;
  font-family: Ubuntu, sans-serif;
}
.tnnc-text-area textarea::placeholder {
  color: var(--tnnc-add-color-gray-3);
  font-size: 16px;
  font-family: Ubuntu, sans-serif;
}
.tnnc-text-area textarea:read-only {
  border-color: var(--color-border);
  cursor: default;
}
.tnnc-text-area-counter {
  padding: 10px;
  text-align: right;
}
.tnnc-text-area-counter .tnnc-counter {
  color: var(--tnnc-add-color-gray-3);
}
.active .tnnc-text-area-counter .tnnc-counter {
  color: var(--tnnc-color-black);
}
.tnnc-input-labeled.invalid .tnnc-text-area {
  border-color: var(--tnnc-color-red);
}
.tnnc-input-labeled .invalid-icon i {
  padding: 0 5px;
  color: var(--tnnc-color-red);
}
.tnnc-text-area .invalid-icon {
  position: absolute;
  right: 2px;
  bottom: 10px;
}
</style>
