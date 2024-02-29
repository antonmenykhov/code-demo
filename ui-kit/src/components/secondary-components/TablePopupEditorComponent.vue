<template>
  <PopupComponent
    v-model:visible="isPopupVisible"
    width="70vw"
    height="95vh"
    cssClass="tnnc-table-popup-editor-popup"
    :showTopBar="false"
  >
    <table class="tnnc-table-popup-editor">
      <tbody>
        <TableEditorComponent
          :columns="columnsWithHeadersCell"
          :row="row"
          :expandedRows="expandedRows"
          :tableProps="tableProps"
          :masterDetailOpened="masterDetailOpened"
          :rawRows="rawRows"
          :all-plain-columns="allPlainColumns"
          :selectedRowsIds="selectedRowsIds"
          :meta="meta"
        />
      </tbody>
    </table>
  </PopupComponent>
</template>
<script lang="ts" setup>
import TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { computed, onMounted, ref, type Component } from 'vue';
import PopupComponent from '../PopupComponent.vue';
import type { Meta } from '../TableComponent.vue';
import type { CustomManageButton } from './ManageCell.vue';
import TableEditorComponent from './TableEditorComponent.vue';

const props = defineProps<{
  row: TableRow;
  columns: TableColumn[];
  allPlainColumns: TableColumn[];
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
  meta?: Meta;
  masterDetailOpened: Set<string>;
  expandedRows: Set<string | number>;
  rawRows: TableRow[];
  selectedRowsIds: Set<string>;
}>();

const isPopupVisible = ref(false);

onMounted(() => {
  isPopupVisible.value = true;
});

const renderedColumns = computed(() =>
  props.allPlainColumns.filter((column) => column.rendered),
);
const columnsWithHeadersCell = computed(() => {
  const columns: TableColumn[] = [];
  renderedColumns.value.forEach((column) => {
    columns.push(
      new TableColumn({
        name: `_${column.name}`,
        templating: {
          cellHtml: () => {
            return `<div class="card-field-header"> ${column.caption}</div>`;
          },
        },
      }),
    );
    columns.push(column);
  });
  return columns;
});
</script>
<style>
.tnnc-table-popup-editor tr {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: stretch;
  background: var(--tnnc-color-gray-light);
}
.tnnc-table-popup-editor td:nth-child(4n + 1),
.tnnc-table-popup-editor td:nth-child(4n + 2) {
  background: var(--tnnc-color-gray-standart);
}
.tnnc-table-popup-editor tr td:nth-child(odd) {
  text-align: right;
}
.tnnc-table-popup-editor tr td {
  padding: 5px 5px;
}
.tnnc-table-popup-editor tr td:nth-child(odd) > div {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}
.card-field-header {
  font-weight: 500;
}
.tnnc-table-popup-editor tr td:nth-child(1),
.tnnc-table-popup-editor tr td:nth-child(2) {
  position: sticky;
  top: 0px;
  z-index: 20;
}
.tnnc-table-popup-editor-popup .tnnc-popup-content {
  padding: 0;
  margin-top: 0;
}
</style>
