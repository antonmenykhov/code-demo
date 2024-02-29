<template>
  <Teleport to="body">
    <div class="tnnc-draggable-row" ref="target" :style="styleString">
      <div
        class="tnnc-draggable-cell"
        v-for="col in renderedColumn"
        :key="col.id"
        :style="`width:${col.width}px`"
      >
        <ManageCell
          v-if="col.columnType === 'manage'"
          :row="currentRow"
          :column="col"
          :table-props="tableProps"
          :selected-rows-ids="selectedRowsIds"
          :master-detail-opened="masterDetailOpened"
        />
        <template v-else>
          {{ currentRow[col.name] }}
        </template>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { computed, type Component } from 'vue';
import ManageCell, { type CustomManageButton } from './ManageCell.vue';

const props = defineProps<{
  rows: TableRow[];
  renderedColumn: TableColumn[];
  initMouseEvent: MouseEvent;
  rowId: string;
  keyExpr: string;
  masterDetailOpened: Set<string>;
  selectedRowsIds: Set<string>;
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
const currentRow = computed(
  () =>
    props.rows.find(
      (row) => `${row[props.keyExpr]}` === props.rowId,
    ) as TableRow,
);
const styleString = computed(() => {
  return `left:${props.initMouseEvent.clientX - 30}px; top:${
    props.initMouseEvent.clientY - 10
  }px;`;
});
</script>
<style>
.tnnc-draggable-row {
  display: inline-flex;
  height: 25px;
  border: 1px solid var(--tnnc-color-blue);
  position: fixed;
  background: white;
  z-index: 9999;
}
.tnnc-draggable-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-right: 1px solid var(--tnnc-color-blue);
}
</style>
