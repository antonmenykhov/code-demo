<template>
  <div :id="listName" class="tnnc-draggable-list" :class="listCssClass">
    <h5 v-if="items.length === 0">{{ placeholder }}</h5>
    <div
      v-for="(item, index) in items"
      :key="index"
      :id="`${listName}_${index}`"
      class="tnnc-draggable-list-item"
      :class="itemCssClass"
    >
      <button
        class="tnnc-draggable-list-button"
        @mousedown.prevent="(e) => startDragging(item, index, e)"
      >
        <i class="fa-solid fa-up-down-left-right"></i>
      </button>

      <slot name="listItem" :listItem="item"></slot>
    </div>
    <Teleport to="body">
      <div
        v-if="reorderedItem"
        :key="reorderedIndex"
        :id="`${listName}_${reorderedIndex}_draggable`"
        class="tnnc-draggable-list-item draggable"
        :style="styleString"
      >
        <button @click.prevent="() => {}" class="tnnc-draggable-list-button">
          <i class="fa-solid fa-up-down-left-right"></i>
        </button>

        <slot name="listItem" :listItem="reorderedItem"></slot>
      </div>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import { ref, type Ref } from 'vue';

const props = withDefaults(
  defineProps<{
    items: any[];
    listName: string;
    placeholder?: string;
    listCssClass?: string;
    itemCssClass?: string;
    availableListNames?: string[];
  }>(),
  {
    placeholder: 'Пусто...',
  },
);
const emit = defineEmits<{
  (
    e: 'dragging',
    data: {
      oldIndex: number;
      oldList: string;
      newIndex: number;
      newList: string;
    },
  ): void;
}>();
const reorderedItem: Ref<any> = ref(null);
const reorderedIndex: Ref<number> = ref(-1);
const styleString = ref('');
const lastHovered: Ref<Element | null> = ref(null);
const lastHoveredList: Ref<Element | null> = ref(null);
function startDragging(item: any, index: number, e: MouseEvent) {
  e.preventDefault();
  reorderedItem.value = item;
  reorderedIndex.value = index;
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', stopDragging);
  styleString.value = `top: ${e.clientY - 5}px; left: ${e.clientX - 5}px`;
}
function mouseMove(e: MouseEvent) {
  styleString.value = `top: ${e.clientY - 5}px; left: ${e.clientX - 5}px`;
  const targets = document.elementsFromPoint(e.clientX, e.clientY);
  const list = targets.filter(
    (elem) =>
      elem.classList.contains('tnnc-draggable-list') &&
      (props.availableListNames === undefined ||
        (props.availableListNames &&
          props.availableListNames.includes(elem.id))),
  )?.[0];
  if (lastHoveredList.value) {
    lastHoveredList.value.classList.remove('hovered');
  }

  const item = targets.filter(
    (elem) =>
      elem.classList.contains('tnnc-draggable-list-item') &&
      elem.id !== `${props.listName}_${reorderedIndex.value}_draggable` &&
      (props.availableListNames === undefined ||
        (props.availableListNames &&
          props.availableListNames.includes(elem.id.split('_')[0]))),
  )?.[0];
  if (lastHovered.value && lastHovered.value !== item) {
    lastHovered.value.classList.remove('hovered');
  }
  if (list) {
    const { top, bottom } = list.getBoundingClientRect();
    if (e.clientY + 20 > bottom)
      list.scrollTo({ top: list.scrollTop + 20, behavior: 'smooth' });
    if (e.clientY - 20 < top)
      list.scrollTo({ top: list.scrollTop - 20, behavior: 'smooth' });
  }

  if (item && list) {
    item.classList.add('hovered');
    lastHovered.value = item;
  }
  if (list && !item) {
    list.classList.add('hovered');
    lastHoveredList.value = list;
  }
}
function stopDragging(e: MouseEvent) {
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('mouseup', stopDragging);
  if (lastHovered.value) {
    lastHovered.value.classList.remove('hovered');
    lastHovered.value = null;
  }
  if (lastHoveredList.value) {
    lastHoveredList.value.classList.remove('hovered');
    lastHoveredList.value = null;
  }
  const targets = document.elementsFromPoint(e.clientX, e.clientY);
  const list = targets.filter(
    (elem) =>
      elem.classList.contains('tnnc-draggable-list') &&
      (props.availableListNames === undefined ||
        (props.availableListNames &&
          props.availableListNames.includes(elem.id))),
  )?.[0];
  const item = targets.filter(
    (elem) =>
      elem.classList.contains('tnnc-draggable-list-item') &&
      elem.id !== `${props.listName}_${reorderedIndex.value}_draggable` &&
      (props.availableListNames === undefined ||
        (props.availableListNames &&
          props.availableListNames.includes(elem.id.split('_')[0]))),
  )?.[0];
  emit('dragging', {
    oldIndex: reorderedIndex.value,
    oldList: props.listName,
    newIndex: item ? +item.id.split('_')[1] : -1,
    newList: list ? list.id : '',
  });
  reorderedIndex.value = -1;
  reorderedItem.value = null;
}
</script>
<style>
.tnnc-draggable-list {
  background: white;
  border-radius: 5px;
  min-height: 100px;
  padding: 8px;
  overflow: auto;
  padding-bottom: 30px;
  border: 2px solid transparent;
}
.tnnc-draggable-list.hovered {
  border: 2px solid var(--tnnc-color-blue);
}
.tnnc-draggable-list-item {
  display: flex;
  padding: 1px 3px 3px;
  border-bottom: 1px solid var(--tnnc-color-gray-standart);
  margin-top: 0;
  border-top: 2px solid transparent;
}
.tnnc-draggable-list-item.hovered {
  border-top: 2px solid var(--tnnc-color-blue);
}
.tnnc-draggable-list-item .tnnc-draggable-list-button i {
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
}
.tnnc-draggable-list-item .tnnc-draggable-list-button {
  border: 0;
  background: 0;
  outline: 0;
}
.tnnc-draggable-list-item.draggable {
  position: fixed;
  background: white;
  z-index: 9999;
}
</style>
