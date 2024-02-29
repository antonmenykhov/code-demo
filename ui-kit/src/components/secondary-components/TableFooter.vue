<template>
  <tfoot>
    <tr class="tnnc-table-row" v-for="total in totals" :key="total.name">
      <td
        v-for="column in columns"
        :key="column.id"
        class="tnnc-table-cell"
        :class="[
          column.name,
          column.cssClass,
          { 'tnnc-fixed-column': column.fixed },
        ]"
        :style="`left: ${column.offset}px`"
        :colspan="column.colspan"
      >
        <template v-if="column.columnType === 'manage'">
          {{ total.name }}
          {{ tableProps.showTotalCounter ? `(${computedRows.length})` : '' }}
        </template>
        <template
          v-else-if="
            (column.columnType === 'number' ||
              column.columnType === 'computed') &&
            !column.excludeFromTotals
          "
        >
          {{
            total.function(
              column,
              computedRows,
              tableProps.numberFormatingEd,
              tableProps.numberFormatingRazryad,
            )
          }}
        </template>
      </td>
    </tr>
  </tfoot>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import type { Component } from 'vue';
import type { TableTotal } from '../TableComponent.vue';
import type { CustomManageButton } from './ManageCell.vue';

const props = defineProps<{
  columns: TableColumn[];
  computedRows: TableRow[];
  totals: TableTotal[];
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
    showTotalCounter: boolean;
  };
}>();
</script>
<style>
tfoot {
  position: sticky;
  bottom: 0;
  z-index: 6;
  background: white;
}
.tnnc-table tfoot td {
  border-top: 1px solid var(--tnnc-add-color-gray-4);
  font-weight: 500;
  text-align: right;
}
</style>
