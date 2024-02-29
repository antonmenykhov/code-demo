<template>
  <div class="tnnc-table-manage-cell">
    <div
      class="tnnc-group-header"
      v-if="row._name"
      :style="`padding-left:${+row._level * 10}px`"
      :data-columnId="row._groupedColumnId"
      @click.prevent="toggleExpandedGroupNames"
    >
      <button
        class="tnnc-input-button tnnc-manage-button"
        @click.prevent="() => {}"
      >
        <i
          class="fa-solid fa-chevron-down"
          :class="{ rotated: !row.expanded }"
        ></i>
      </button>
      <div class="tnnc-group-header-title">{{ row._name }}</div>
    </div>
    <template v-else>
      <button
        v-if="tableProps.allowReordering && !isEditing"
        class="tnnc-input-button tnnc-manage-button"
        title="Переместить"
        @click.prevent="() => {}"
        @mousedown.prevent="startDragging"
      >
        <i class="color-blue fa-solid fa-arrows-up-down-left-right"></i>
      </button>
      <button
        v-if="(tableProps.allowEdit || tableProps.allowAdd) && isEditing"
        class="tnnc-input-button tnnc-manage-button"
        :title="
          hasInvalidValues
            ? 'Проверьте правильность заполнения полей'
            : 'Сохранить'
        "
        :disabled="hasInvalidValues"
        @click.prevent="saveRow"
      >
        <i class="fa-solid fa-save color-blue"></i>
      </button>
      <button
        v-if="(tableProps.allowEdit || tableProps.allowAdd) && isEditing"
        class="tnnc-input-button tnnc-manage-button"
        title="Отмена"
        @click.prevent="stopEditingInjected(row)"
      >
        <i class="fa-solid fa-ban color-blue"></i>
      </button>
      <button
        v-if="tableProps.allowEdit && !isEditing"
        class="tnnc-input-button tnnc-manage-button"
        title="Редактировать"
        @click.prevent="startEditingInjected(row)"
      >
        <i class="fa-solid fa-pen color-blue"></i>
      </button>
      <button
        v-if="tableProps.allowDelete && !isEditing"
        class="tnnc-input-button tnnc-manage-button"
        title="Удалить"
        @click.prevent="deleteRowInjected(row)"
      >
        <i class="fa-solid fa-trash color-blue"></i>
      </button>
      <button
        v-if="tableProps.allowExpand"
        class="tnnc-input-button tnnc-manage-button"
        :title="
          masterDetailOpened.has(`${row[tableProps.keyExpr]}`)
            ? 'Свернуть'
            : 'Развернуть'
        "
        @click.prevent="toggleMasterDetail"
      >
        <i
          class="fa-solid fa-chevron-down"
          :class="{
            rotated: !masterDetailOpened.has(`${row[tableProps.keyExpr]}`),
            'color-blue': hasMasterDetailElements,
          }"
        ></i>
      </button>
      <button
        v-for="manageButton in tableProps.customManageButtons"
        :key="manageButton.icon"
        v-show="manageButton.condition ? manageButton.condition(row) : true"
        class="tnnc-input-button tnnc-manage-button"
        :title="manageButton.title"
        @click.prevent="() => manageButton.fn(row)"
      >
        <i class="color-blue" :class="manageButton.icon"></i>
      </button>
      <Checkbox
        v-if="tableProps.allowSelection && !isEditing"
        :value="isSelected"
        css-class="small-size"
        @update:value="toggleSelection"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { computed, inject, type Component, type Ref } from 'vue';
import Checkbox from '../Checkbox.vue';

export type CustomManageButton<T = any> = {
  icon: string;
  title: string;
  fn: (row: TableRow<T>) => void;
  condition?: (row: TableRow<T>, isEditing?: boolean) => boolean;
};

const props = defineProps<{
  isEditing?: boolean;
  column: TableColumn;
  row: TableRow;
  masterDetailOpened: Set<string>;
  selectedRowsIds: Set<string>;
  hasInvalidValues?: boolean;
  tableProps: {
    allowAdd: boolean;
    allowDelete: boolean;
    allowEdit: boolean;
    allowExpand: boolean;
    allowFilter: boolean;
    addEnumId: boolean;
    allowPagination: boolean;
    allowRowCounter: boolean;
    allowSelection: boolean;
    allowToolbar: boolean;
    allowColumnNumeration: boolean;
    keyExpr: string;
    numberFormatingEd: number;
    numberFormatingRazryad: number;
    expanderTemplate?: Component;
    expandablePropertyName: string;
    customManageButtons?: CustomManageButton[];
    allowReordering: boolean;
  };
}>();
const emit = defineEmits<{ (e: 'saveRow'): void }>();
const toggleExpandedGroupNamesInjected = inject('toggleExpandedGroupNames') as (
  name: string,
) => void;
const toggleMasterDetailInjected = inject('toggleMasterDetail') as (
  rowId: string,
) => void;
const startEditingInjected = inject('startEditing') as (row: TableRow) => void;
const stopEditingInjected = inject('stopEditing') as (row: TableRow) => void;
const deleteRowInjected = inject('deleteRow') as (row: TableRow) => void;
function saveRow() {
  emit('saveRow');
}
function toggleExpandedGroupNames() {
  toggleExpandedGroupNamesInjected(props.row._UUID as string);
}
function toggleMasterDetail() {
  toggleMasterDetailInjected(`${props.row[props.tableProps.keyExpr]}`);
}
const hasMasterDetailElements = computed(
  () => props.row[props.tableProps.expandablePropertyName] === true,
);

const isSelected = computed(() =>
  props.selectedRowsIds.has(`${props.row[props.tableProps.keyExpr]}`),
);

const toggleSelectionInjected = inject('toggleSelection') as (
  rowId: string,
) => void;
function toggleSelection() {
  toggleSelectionInjected(`${props.row[props.tableProps.keyExpr]}`);
}

const startDraggingInjected = inject('startDragging') as (
  rowId: string,
  mouseEvent: MouseEvent,
  initIndex: string,
) => void;
function startDragging(e: MouseEvent) {
  startDraggingInjected(
    `${props.row[props.tableProps.keyExpr]}`,
    e,
    `${props.row['_index']}`,
  );
}
</script>
<style>
.tnnc-group-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
}
.tnnc-group-header-title {
  font-weight: 500;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: break-spaces;
}
.tnnc-manage-button {
  max-height: 20px;
  width: 15px;
}
.tnnc-manage-button:hover {
  opacity: 0.9;
}

.tnnc-table-manage-cell {
  display: flex;
  justify-content: center;
  gap: 7px;
  width: 100%;
  overflow: hidden;
}
.rotated {
  transform: rotate(-90deg);
}
.color-blue {
  color: var(--tnnc-color-blue);
}
.tnnc-manage-button:active i {
  transition: 0.2s;
  color: var(--tnnc-add-color-gray-1) !important;
}
.tnnc-table-manage-cell .small-size input[type='checkbox'] {
  width: 20px;
  height: 20px;
  border-radius: 6px;
}
.tnnc-manage-button:disabled i {
  color: var(--tnnc-add-color-gray-3);
}
.tnnc-manage-button:disabled {
  cursor: not-allowed;
}
</style>
