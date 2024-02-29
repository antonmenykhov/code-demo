<template>
  <thead class="tnnc-table-header">
    <tr
      v-for="columnRow in headers"
      :key="`${columnRow[0]?.name}-row`"
      class="tnnc-table-header-row"
      :class="{
        'tnnc-header-tiny': isHeadersTiny,
      }"
    >
      <th
        v-for="column in columnRow"
        :key="column.name"
        :colspan="column.colspan"
        :rowspan="column.rowspan"
        class="tnnc-table-header-cell"
        :class="[
          column.name,
          column.cssClass,
          column.columnType,
          {
            'tnnc-fixed-column': column.fixed,
          },
        ]"
        :style="`left: ${column.offset}px`"
        :title="column.description"
        :data-fixed="column.fixed"
        :data-id="column.id"
        :data-collapsable="
          column.collapsing.collapsable && column.child.length > 1
        "
        :data-collapsed="column.collapsing.collapsed"
        :data-sortable="column.child.length === 0"
        :data-name="column.name"
        :data-grouped="groupedColumnIds.has(column.id)"
        :data-type="column.columnType"
        :data-sort-direction="sortedObject[column.name]"
      >
        {{ column.caption }}
        <div
          class="tnnc-header-icon-line"
          v-if="column.columnType !== 'manage'"
        >
          <i
            v-if="column.fixed"
            class="header-icon fa-solid fa-paperclip"
            title="Столбец закреплен"
          ></i>
          <i
            v-if="groupedColumnIds.has(column.id)"
            class="header-icon fa-solid fa-layer-group"
            title="Сгруппировано по этому столбцу"
          ></i>
          <i
            v-if="sortedObject[column.name]"
            class="header-icon fa-solid"
            :class="
              sortedObject[column.name] === 'asc'
                ? 'fa-arrow-down-wide-short'
                : 'fa-arrow-up-wide-short'
            "
            title="Отсортировано по этому столбцу"
          >
            <span>{{
              sortedColumns.findIndex((col) => col.columnName === column.name) +
              1
            }}</span></i
          >
        </div>
        <TableHeaderResizer
          v-if="column.columnType !== 'joined' && column.name !== 'manage-cell'"
          :width="column.width"
          :id="column.id"
        />
      </th>
    </tr>
    <tr v-if="allowFilter" class="tnnc-table-filter-row">
      <FilterCell
        v-for="column in columns"
        :key="`${column.name}filter`"
        :filter-collection="filterCollection"
        :column="column"
        v-model:filter-set="editableFilterSet"
      />
    </tr>
    <tr v-if="allowColumnNumeration">
      <td
        v-for="column in columns"
        :key="`${column.name}number`"
        class="tnnc-table-header-cell"
        :class="[
          column.name,
          column.cssClass,
          { 'tnnc-fixed-column': column.fixed },
        ]"
        :style="`left: ${column.offset}px`"
        :colspan="column.colspan"
      >
        {{ column.number }}
      </td>
    </tr>
    <tr v-for="total in headerTotals" :key="total.name">
      <td
        v-for="column in columns"
        :key="column.id"
        class="tnnc-table-cell tnnc-table-total"
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
  </thead>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type {
  FilterCollection,
  FilterValue,
} from '@/composables/useFilters.composable';
import { useVModel } from '@vueuse/core';
import type { Meta, TableTotal } from '../TableComponent.vue';
import FilterCell from './FilterCell.vue';
import TableHeaderResizer from './TableHeaderResizer.vue';
import { computed, inject, type Ref } from 'vue';
import type { TableRow } from '@/interfaces/table-row.interface';

export type AnyType = {
  [key: string]:
    | string
    | number
    | boolean
    | AnyType
    | null
    | Array<string | number | boolean | AnyType | null>;
};
const props = defineProps<{
  headers: TableColumn[][];
  columns: TableColumn[];
  filterCollection: FilterCollection[];
  filterSet: FilterValue[];
  groupedColumnIds: Set<string>;
  meta?: Meta;
  allowColumnNumeration: boolean;
  allowFilter: boolean;
  isHeadersTiny: boolean;
  headerTotals?: TableTotal[];
  computedRows: TableRow[];
  tableProps: {
    numberFormatingEd: number;
    numberFormatingRazryad: number;
    showTotalCounter: boolean;
  };
}>();
const emit = defineEmits<{
  (e: 'update:filterSet', data: FilterValue[]): void;
}>();
const editableFilterSet = useVModel(props, 'filterSet', emit);
const sortedColumns = inject('sortedColumns') as Ref<
  { columnName: string; direction: 'asc' | 'desc' }[]
>;
const sortedObject = computed(() => {
  const obj: { [key: string]: 'asc' | 'desc' } = {};
  sortedColumns.value.forEach((column) => {
    obj[column.columnName] = column.direction;
  });
  return obj;
});
</script>
<style>
.tnnc-table-header-cell {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  white-space: pre-wrap;
}
.tnnc-header-tiny th {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tnnc-table-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 6;
}
.tnnc-table-header-cell .header-icon {
  padding: 2px;
  border-radius: 50%;
  background: white;
  font-size: 12px;
}
.tnnc-table-header-cell .header-icon span {
  font-size: 8px;
  font-weight: 100;
}
.tnnc-header-icon-line {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  justify-content: flex-end;
  gap: 3px;
}
.tnnc-table-total {
  font-weight: 500;
  text-align: right;
}
</style>
