<template>
  <tbody>
    <tr class="tnnc-table-spacer" :style="`height:${topOffset}px`">
      <td :colspan="columns.length"></td>
    </tr>
    <TableEditorComponent
      v-if="editingRowIds.has(`new`)"
      :columns="columns"
      :row="newRow"
      :expandedRows="expandedRows"
      :tableProps="tableProps"
      :masterDetailOpened="masterDetailOpened"
      :rawRows="rawRows"
      :all-plain-columns="allPlainColumns"
      :selectedRowsIds="selectedRowsIds"
      :meta="meta"
    />
    <template v-for="row in rows" :key="`${row[tableProps.keyExpr]}`">
      <component
        v-if="tableProps.rowTemplate"
        :is="tableProps.rowTemplate"
        :columns="columns"
        :row="row"
        :expandedRows="expandedRows"
        :tableProps="tableProps"
        :masterDetailOpened="masterDetailOpened"
        :rawRows="rawRows"
        :all-plain-columns="allPlainColumns"
        :selectedRowsIds="selectedRowsIds"
        :meta="meta"
        :editingRowIds="editingRowIds"
      />
      <TablePopupEditorComponent
        v-else-if="
          editingRowIds.has(`${row[tableProps.keyExpr]}`) &&
          tableProps.popupEditor
        "
        :columns="columns"
        :row="row"
        :expandedRows="expandedRows"
        :tableProps="tableProps"
        :masterDetailOpened="masterDetailOpened"
        :rawRows="rawRows"
        :all-plain-columns="allPlainColumns"
        :selectedRowsIds="selectedRowsIds"
        :meta="meta"
      />
      <TableEditorComponent
        v-else-if="editingRowIds.has(`${row[tableProps.keyExpr]}`)"
        :columns="columns"
        :row="row"
        :expandedRows="expandedRows"
        :tableProps="tableProps"
        :masterDetailOpened="masterDetailOpened"
        :rawRows="rawRows"
        :all-plain-columns="allPlainColumns"
        :selectedRowsIds="selectedRowsIds"
        :meta="meta"
      />
      <TableRowComponent
        v-else
        :columns="columns"
        :row="row"
        :expandedRows="expandedRows"
        :tableProps="tableProps"
        :masterDetailOpened="masterDetailOpened"
        :selectedRowsIds="selectedRowsIds"
        :meta="meta"
      />
      <component
        v-if="
          tableProps.expanderTemplate &&
          tableProps.allowExpand &&
          masterDetailOpened.has(`${row[tableProps.keyExpr]}`)
        "
        :is="tableProps.expanderTemplate"
        :row="row"
        :columns="columns"
        :tableProps="tableProps"
        :meta="meta"
        :masterDetailOpened="masterDetailOpened"
        :rawRows="rawRows"
        :all-plain-columns="allPlainColumns"
      />
    </template>
    <tr class="tnnc-table-spacer" :style="`height:${bottomOffset}px`">
      <td :colspan="columns.length"></td>
    </tr>
  </tbody>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { ref, type Component } from 'vue';
import type { Meta } from '../TableComponent.vue';
import type { CustomManageButton } from './ManageCell.vue';
import TableEditorComponent from './TableEditorComponent.vue';
import TablePopupEditorComponent from './TablePopupEditorComponent.vue';
import TableRowComponent from './TableRowComponent.vue';

const props = defineProps<{
  columns: TableColumn[];
  allPlainColumns: TableColumn[];
  rows: TableRow[];
  expandedRows: Set<string | number>;
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
    rowTemplate?: Component;
    popupEditor?: boolean;
  };
  masterDetailOpened: Set<string>;
  meta?: Meta;
  editingRowIds: Set<string>;
  rawRows: TableRow[];
  selectedRowsIds: Set<string>;
  topOffset: number;
  bottomOffset: number;
}>();
const newRow = ref({ [props.tableProps.keyExpr]: 'new' } as TableRow);
</script>
<style>
.tnnc-table tbody td {
  overflow: hidden;
  white-space: nowrap;
}
.tnnc-table tbody .tnnc-table-expanded-row td {
  white-space: pre-wrap;
  background: var(--tnnc-color-gray-light);
}
.tnnc-table tbody tr:hover td {
  background: #eff5fb;
}
.tnnc-table-spacer td {
  background: linear-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 20%,
    rgba(128, 128, 128, 0.03) 20%,
    rgba(128, 128, 128, 0.08) 50%,
    rgba(128, 128, 128, 0.03) 80%,
    rgba(255, 255, 255, 0) 80%,
    rgba(255, 255, 255, 0)
  );
  background-size: 100% 50px;
  height: inherit !important;
  padding: 0 !important;
}
</style>
