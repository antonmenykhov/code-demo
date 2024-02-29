<template>
  <tr
    class="tnnc-table-row"
    :data-index="row['_index']"
    :class="[
      row._rowCssClass,
      {
        'tnnc-table-expanded-row': expandedRows.has(
          `${row[tableProps.keyExpr]}`,
        ),
      },
    ]"
  >
    <td
      v-for="col in columns"
      :key="col.name"
      class="tnnc-table-cell"
      :class="[
        col.name,
        col.cssClass,
        col.columnType,
        calcCssClass(col, row),
        {
          'tnnc-fixed-column': col.fixed,
          hidden: col.name === tableProps.keyExpr && row._UUID,
        },
      ]"
      :style="`left: ${col.offset}px`"
      :colspan="col.colspan"
      :data-row-id="row[tableProps.keyExpr]"
      :data-column-name="col.name"
    >
      <component
        v-if="col.templating?.cell"
        :is="col.templating.cell"
        :column="col"
        :row="row"
        :tableProps="tableProps"
        :masterDetailOpened="masterDetailOpened"
        :meta="meta"
        :selectedRowsIds="selectedRowsIds"
      />
      <div
        v-else-if="col.templating?.cellHtml"
        v-html="
          col.templating.cellHtml(
            row._rawRow,
            col,
            props.tableProps.numberFormatingEd,
            props.tableProps.numberFormatingRazryad,
            props.meta,
          )
        "
      ></div>
      <template v-else>
        {{ row[col.name] !== '(Пусто)' ? row[col.name] : '' }}
      </template>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import type { Component } from 'vue';
import type { Meta } from '../TableComponent.vue';
import type { CustomManageButton } from './ManageCell.vue';

const props = defineProps<{
  row: TableRow;
  columns: TableColumn[];
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
  selectedRowsIds: Set<string>;
}>();
function calcCssClass(column: TableColumn, row: TableRow) {
  if (column.computing?.cssClass) {
    return column.computing.cssClass(
      row,
      column,
      props.tableProps.numberFormatingEd,
      props.tableProps.numberFormatingRazryad,
      props.meta,
    );
  }
  return '';
}
</script>
<style>
.hidden {
  color: transparent;
}
</style>
