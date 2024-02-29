<template>
  <div class="tnnc-uploader" ref="dropZone" :class="[cssClass]">
    <label
      :for="id"
      class="tnnc-drop-zone"
      :class="{ hovered: isOverDropZone }"
    >
      {{ fileListNames }}
    </label>
    <input
      :id="id"
      type="file"
      @change="setFile"
      :accept="accept"
      :multiple="multiply"
    />
  </div>
</template>
<script lang="ts" setup>
import { useDropZone } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, type Ref } from 'vue';

const props = defineProps<{
  accept?: string;
  multiply?: boolean;
  cssClass?: string;
  placeholder?: string;
}>();

const id = ref(uuidv4());
const files: Ref<FileList | null> = ref(null);
const emit = defineEmits<{
  (e: 'fileChanged', data: FileList | null): void;
}>();

function setFile(payload: Event) {
  const target = payload.target as HTMLInputElement;
  files.value = target.files;
  emit('fileChanged', files.value?.length ? files.value : null);
}

const fileListNames = computed(() => {
  if (files.value && files.value.length) {
    return Object.keys(files.value).map((key, index) =>
      files.value ? files.value[index].name : '',
    ).join(`
      `);
  }
  return props.placeholder || 'Поместите файл сюда, или нажмите для выбора';
});

function onDrop(newFiles: any | null) {
  files.value = newFiles;
  emit('fileChanged', files.value?.length ? files.value : null);
}
const dropZone = ref(null);
const { isOverDropZone } = useDropZone(dropZone, onDrop);
</script>
<style>
.tnnc-uploader input {
  display: inline-block;
  opacity: 0;
  overflow: hidden;
  position: relative;
  min-height: 40px;
}
.tnnc-drop-zone {
  border: 2px dashed;
  border-color: var(--tnnc-add-color-gray-4);
  padding: 10px;
  transition: all 0.2s;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  z-index: 0;
  overflow: auto;
}
.tnnc-drop-zone:hover,
.tnnc-drop-zone.hovered {
  border-color: var(--tnnc-color-blue);
}
</style>
