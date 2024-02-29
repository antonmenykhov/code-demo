<template>
  <div class="tnnc-table" :class="[cssClass]">
    <div v-if="allowToolbar" class="tnnc-table-toolbar">
      <div class="left"><slot name="toolbar-left"></slot></div>
      <div class="right">
        <slot name="toolbar-right-before"></slot>
        <ButtonComponent v-if="allowAdd" text="Добавить" @click="addNewRow" />
        <ButtonComponent
          v-if="allowFilter"
          text="Сброс фильтра"
          :disabled="currentFilter.length === 0"
          @click="clearFilter"
        />
        <SelectBox
          v-if="columnChooser"
          label="Выбор столбцов"
          :options="
            tableColumnsTree.filter(
              (column) => !column.excludeFromColumnChooser,
            )
          "
          v-model:value="renderedColumnsIds"
          display-expr="caption"
          value-expr="id"
          buttonMode
          :is-tree="true"
          :option-css-class="'tnnc-column-chooser'"
          :options-width="300"
        />
        <slot name="toolbar-right-after"></slot>
        <DropDownButton
          v-if="additionalFeatures"
          text="Доп. функции"
          list-css-class="tnnc-drop-down-table"
        >
          <Toggle v-model:value="isHeadersTiny" label="Компактные заголовки" />
          <Toggle
            v-if="allowFilter"
            v-model:value="isFilterVisible"
            label="Показывать фильтр"
          />
          <Toggle v-model:value="isAllCollapsed" label="Скрыть детализацию" />
          <ButtonComponent
            v-if="allowExport"
            text="Экспорт"
            @click="exportTable"
          />
          <slot name="toolbar-right"></slot>
        </DropDownButton>
      </div>
    </div>
    <div class="tnnc-table-wrapper" ref="tableWrapper">
      <div
        class="tnnc-table-virtual-space"
        :style="`height: ${virtualTableHeight}px`"
      ></div>
      <table
        ref="table"
        @contextmenu="contextMenuHandler"
        @click="clickHandler"
      >
        <colgroup>
          <col
            v-for="col in cols"
            :key="col.name"
            :style="`width: ${col.width}px;`"
          />
        </colgroup>
        <TableHeader
          :columns="tableBodyRenderParams.columns"
          :headers="tableHeaders"
          :meta="meta"
          :filter-collection="filterCollection"
          :grouped-column-ids="groupedColumnIds"
          :allow-column-numeration="allowColumnNumeration"
          :allow-filter="allowFilter && isFilterVisible"
          :is-headers-tiny="isHeadersTiny"
          :headerTotals="headerTotals"
          :computed-rows="filteredRows"
          :table-props="propsComputed"
          v-model:filter-set="currentFilter"
        />
        <TableBody
          :columns="tableBodyRenderParams.columns"
          :rows="renderedRows"
          :key-expr="keyExpr"
          :page-size="pageSize"
          :expanded-rows="expandedRows"
          :table-props="propsComputed"
          :masterDetailOpened="masterDetailOpened"
          :editing-row-ids="editingRowIds"
          :raw-rows="rows"
          :all-plain-columns="tableColumnsPlain"
          :selected-rows-ids="selectedRowsIds"
          :meta="meta"
          :virtualTableHeight="virtualTableHeight"
          :topOffset="topOffset"
          :bottomOffset="bottomOffset"
        />
        <TableFooter
          v-if="totals"
          :columns="tableBodyRenderParams.columns"
          :computed-rows="filteredRows"
          :table-props="propsComputed"
          :totals="totals"
        />
      </table>
      <DraggableRow
        v-if="initMouseEvent && isDraggingNow"
        :rows="currentRowSet"
        :init-mouse-event="initMouseEvent"
        :rendered-column="tableBodyRenderParams.columns"
        :row-id="currentDraggedRowId"
        :key-expr="props.keyExpr"
        :selected-rows-ids="selectedRowsIds"
        :table-props="propsComputed"
        :masterDetailOpened="masterDetailOpened"
      />
    </div>
    <div
      class="tnnc-table-footer"
      v-if="groupedColumnIds.size === 0 && allowPagination"
    >
      <PageSizeSelector v-model:page-size="pageSize" :page-sizes="pageSizes" />
      <Paginator v-model:value="currentPage" :max-value="maxPage" />
    </div>
    <TableHeaderContextMenu
      v-if="mouseEvent"
      :mouse-event="mouseEvent"
      :table-props="propsComputed"
      v-model:visible="contextMenuVisible"
    />
  </div>
</template>
<script lang="ts" setup>
import useColumnCustomization from '@/composables/useColumnCustomization.composable';
import useGenerateColumnsForTable from '@/composables/useColumns.composable';
import useComputedRows from '@/composables/useComputedRows.composable';
import useContextMenu from '@/composables/useContextMenu.composable';
import useEditing, {
  type EditigngSaveEvent,
  type EditigngStopEvent,
  type EditingDeleteEvent,
  type EditingStartEvent,
} from '@/composables/useEditing.composable';
import useFilters from '@/composables/useFilters.composable';
import useGroupedRows from '@/composables/useGroupedRows.composable';
import usePaging from '@/composables/usePaging.composable';
import useRowExpanding from '@/composables/useRowExpanding.composable';
import useSorting from '@/composables/useSorting.composable';
import useTableHeaders from '@/composables/useTableHeaders.composable';
import useVirtualScroll from '@/composables/useVirtualScroll.composable';
import type { Column, ColumnType } from '@/interfaces/column.interface';
import type { TableRow } from '@/interfaces/table-row.interface';
import {
  type Component,
  provide,
  ref,
  computed,
  type Ref,
  onMounted,
  onUpdated,
} from 'vue';
import ButtonComponent from './ButtonComponent.vue';
import Paginator from './Paginator.vue';
import type { CustomManageButton } from './secondary-components/ManageCell.vue';
import PageSizeSelector from './secondary-components/PageSizeSelector.vue';
import TableBody from './secondary-components/TableBody.vue';
import TableHeader from './secondary-components/TableHeader.vue';
import TableHeaderContextMenu from './secondary-components/TableHeaderContextMenu.vue';
import SelectBox from './SelectBox.vue';
import Toggle from './Toggle.vue';
import TableFooter from './secondary-components/TableFooter.vue';
import DropDownButton from './DropDownButton.vue';
import useExport from '@/composables/useExport.combosable';
import useSelection from '@/composables/useSelection.composable';
import useRowDragging, {
  type ReorderingEvent,
} from '@/composables/useRowDragging.composable';
import DraggableRow from './secondary-components/DraggableRow.vue';
import useColumnWidths from '@/composables/useColumnWidths.composable';
import useTableSettings, {
  type TableSettings,
} from '@/composables/useTableSettings.composable';
import type TableColumn from '@/classes/table-column.class';

export type SelectionMode = 'single' | 'multiple';

export interface Handbook {
  [key: string]: any[];
}

export interface Meta {
  [key: string]: any;
}

export interface TableTotal<T = any> {
  name: string;
  function: (
    column: TableColumn,
    rows: Array<TableRow<T>>,
    ed: number,
    razryd: number,
  ) => string;
}

export interface TableProps {
  rows?: TableRow[];
  columns: Column[];
  totals?: TableTotal[];
  headerTotals?: TableTotal[];
  keyExpr?: string;
  allowAdd?: boolean;
  allowDelete?: boolean;
  allowEdit?: boolean;
  allowExpand?: boolean;
  allowSelection?: boolean;
  allowReordering?: boolean;
  selectionMode?: SelectionMode;
  height?: string;
  allowToolbar?: boolean;
  allowPagination?: boolean;
  allowFilter?: boolean;
  allowRowCounter?: boolean;
  allowColumnNumeration?: boolean;
  allowExport?: boolean;
  columnChooser?: boolean;
  additionalFeatures?: boolean;
  meta?: Meta;
  addEnumId?: boolean;
  expanderTemaplte?: Component;
  cssClass?: string;
  numberFormatingEd?: number;
  numberFormatingRazryad?: number;
  isHeadersTiny?: boolean;
  expanderTemplate?: Component;
  rowTemplate?: Component;
  expandablePropertyName?: string;
  customManageButtons?: CustomManageButton[];
  pageSizes?: number[];
  exportName?: string;
  hideZeroNumbers?: boolean;
  autosaveRow?: boolean;
  groupRowsDefaultStateOpened?: boolean;
  defultRowHeight?: number;
  showGroupCounter?: boolean;
  showTotalCounter?: boolean;
  allowGrouping?: boolean;
  allowSorting?: boolean;
  allowFixing?: boolean;
  showLoader?: boolean;
  manageColumnName?: string;
  popupEditor?: boolean;
}

const props = withDefaults(defineProps<TableProps>(), {
  rows: () => [],
  columns: () => [],
  allowAdd: false,
  allowEdit: false,
  allowDelete: false,
  allowExpand: false,
  allowSelection: false,
  allowToolbar: false,
  allowPagination: false,
  allowFilter: false,
  allowRowCounter: false,
  allowColumnNumeration: false,
  allowExport: false,
  allowReordering: false,
  keyExpr: 'id',
  height: '80vh',
  numberFormatingEd: 1,
  numberFormatingRazryad: 2,
  isHeadersTiny: false,
  expandablePropertyName: 'child',
  pageSizes: () => [10, 25, 50, 100],
  exportName: 'Экспорт таблицы',
  selectionMode: 'multiple',
  hideZeroNumbers: false,
  defultRowHeight: 21,
  showGroupCounter: false,
  showTotalCounter: false,
  allowGrouping: false,
  allowSorting: false,
  allowFixing: false,
  showLoader: false,
});
const emit = defineEmits<{
  <T>(e: 'startEditing', data: EditingStartEvent<T>): void;
  <T>(e: 'stopEditing', data: EditigngStopEvent<T>): void;
  <T>(e: 'saveRow', data: EditigngSaveEvent<T>): void;
  <T>(e: 'deleteRow', data: EditingDeleteEvent<T>): void;
  (e: 'reordering', data: ReorderingEvent): void;
  (e: 'selectionChanged', data: Set<string>): void;
  (e: 'settingsChanged', data: TableSettings): void;
  (e: 'mounted'): void;
  (e: 'updated'): void;
}>();
const propColumns = computed(() => props.columns);
const propRows = computed(() => props.rows);
const propMeta = computed(() => props.meta);
const propNumberFormatingEd = computed(() => props.numberFormatingEd);
const propNumberFormatingRazryad = computed(() => props.numberFormatingRazryad);
const propsExportName = computed(() => props.exportName);
const propsComputed = computed(() => ({ ...props }));
const {
  renderedColumnsIds,
  toggleCollapsed,
  toggleFixed,
  toggleFixedGroup,
  fixedColumnIds,
  collapsedColumnsIds,
  getColumnWidth,
  setColumnWidth,
  hideColumn,
  toggleGrouping,
  groupedColumnIds,
  ungroupAll,
  isHeadersTiny,
  isFilterVisible,
  isAllCollapsed,
  defaultPlainColumns,
  customColumnWidths,
} = useColumnCustomization(propColumns, props.isHeadersTiny);
provide('toggleCollapsed', toggleCollapsed);
provide('toggleFixed', toggleFixed);
provide('toggleFixedGroup', toggleFixedGroup);
provide('setColumnWidth', setColumnWidth);
provide('hideColumn', hideColumn);
provide('toggleGrouping', toggleGrouping);
provide('ungroupAll', ungroupAll);
const { tableColumnsForRender, tableColumnsTree, tableColumnsPlain } =
  useGenerateColumnsForTable(
    propsComputed,
    renderedColumnsIds,
    fixedColumnIds,
    collapsedColumnsIds,
    groupedColumnIds,
  );

const { computedRows } = useComputedRows(
  propRows,
  defaultPlainColumns,
  propNumberFormatingEd,
  propNumberFormatingRazryad,
  propMeta,
  props.keyExpr,
  props.expandablePropertyName,
  props.hideZeroNumbers,
);
const { filterCollection, filteredRows, currentFilter, clearFilter } =
  useFilters(tableColumnsForRender, computedRows);

const tableWrapper: Ref<null | HTMLElement> = ref(null);
const table: Ref<null | HTMLElement> = ref(null);

const { setSorting, sortedRows, sortedColumns, removeSorting } = useSorting(
  filteredRows,
  tableColumnsForRender,
);
provide('setSorting', setSorting);
provide('removeSorting', removeSorting);
provide('sortedColumns', sortedColumns);
const { groupedRows, toggleExpandedGroupNames, expandedGroupNames } =
  useGroupedRows(
    sortedRows,
    tableColumnsPlain,
    groupedColumnIds,
    propNumberFormatingEd,
    propNumberFormatingRazryad,
    props.keyExpr,
    propsComputed,
  );
provide('toggleExpandedGroupNames', toggleExpandedGroupNames);

const { currentPage, pageSize, maxPage, rowsPaged } = usePaging(sortedRows);
const currentRowSet = computed(() => {
  return groupedColumnIds.value.size > 0
    ? groupedRows.value
    : props.allowPagination
    ? rowsPaged.value
    : sortedRows.value;
});
const { mouseEvent, contextMenuHandler, contextMenuVisible } = useContextMenu();
const {
  expandedRows,
  toggleExpandingRow,
  masterDetailOpened,
  toggleMasterDetail,
} = useRowExpanding();
provide('toggleMasterDetail', toggleMasterDetail);
const {
  editingRowIds,
  startEditing,
  stopEditing,
  saveRow,
  deleteRow,
  addNewRow,
  saveAllRows,
} = useEditing(propRows, props.keyExpr, emit, table, props.autosaveRow);
provide('startEditing', startEditing);
provide('stopEditing', stopEditing);
provide('saveRow', saveRow);
provide('deleteRow', deleteRow);
function clickHandler(event: MouseEvent) {
  const target = (event.target as HTMLElement).closest('td');
  const manageType: ColumnType = 'manage';
  if (target && !target.classList.contains(manageType)) {
    const rowId = target.dataset.rowId as string;
    toggleExpandingRow(rowId);
  }
}
const { cols } = useColumnWidths(
  defaultPlainColumns,
  tableColumnsForRender,
  getColumnWidth,
  tableWrapper,
);
const { tableHeaders } = useTableHeaders(tableColumnsTree, cols);
const { exportTable } = useExport(
  groupedRows,
  tableColumnsTree,
  tableHeaders,
  propsExportName,
  propsComputed,
);

const { selectedRowsIds, toggleSelection } = useSelection(
  props.selectionMode,
  emit,
);
provide('toggleSelection', toggleSelection);

const {
  startDragging,
  currentDraggedRowId,
  initMouseEvent,
  isDraggingNow,
  stopDragging,
} = useRowDragging(currentRowSet, emit);
provide('startDragging', startDragging);
provide('stopDragging', stopDragging);

const {
  tableBodyRenderParams,
  virtualTableHeight,
  renderedRows,
  topOffset,
  bottomOffset,
} = useVirtualScroll(tableWrapper, cols, currentRowSet, props.defultRowHeight);

const { setSettings, tableSettings } = useTableSettings(
  renderedColumnsIds,
  collapsedColumnsIds,
  fixedColumnIds,
  customColumnWidths,
  groupedColumnIds,
  expandedGroupNames,
  currentPage,
  pageSize,
  expandedRows,
  masterDetailOpened,
  editingRowIds,
  selectedRowsIds,
  currentFilter,
  sortedColumns,
  emit,
);

defineExpose({
  expandedRows,
  renderedColumnsIds,
  masterDetailOpened,
  fixedColumnIds,
  collapsedColumnsIds,
  groupedColumnIds,
  selectedRowsIds,
  tableColumnsTree,
  editingRowIds,
  expandedGroupNames,
  currentPage,
  pageSize,
  maxPage,
  currentFilter,
  filteredRows,
  tableSettings,

  toggleExpandingRow,
  toggleMasterDetail,
  toggleCollapsed,
  toggleFixed,
  toggleFixedGroup,
  getColumnWidth,
  setColumnWidth,
  hideColumn,
  toggleGrouping,
  ungroupAll,
  toggleSelection,
  saveAllRows,
  toggleExpandedGroupNames,
  setSorting,
  removeSorting,
  startEditing,
  stopEditing,
  saveRow,
  deleteRow,
  clearFilter,
  setSettings,
});
onMounted(() => {
  emit('mounted');
});
onUpdated(() => {
  emit('updated');
});
</script>
<style>
.tnnc-table {
  flex: 1;
  overflow: hidden;
}
.tnnc-table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border-radius: 8px;
  border: 10px solid white;
  background: white;
}
.tnnc-table table {
  position: absolute;
  left: 0;
  top: 0;
  table-layout: fixed;
  width: fit-content;
  border-spacing: 0;
  border-radius: 8px;
}
.tnnc-table td,
.tnnc-table th {
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid var(--tnnc-add-color-gray-4);
  border-bottom: 1px solid var(--tnnc-add-color-gray-4);
  padding: 2px;
  min-height: 21px;
}
.tnnc-table td:first-child,
.tnnc-table tr:first-child th:first-child {
  border-left: 1px solid var(--tnnc-add-color-gray-4);
}
.tnnc-table tr:first-child th {
  border-top: 1px solid var(--tnnc-add-color-gray-4);
}
.tnnc-table td.date,
.tnnc-table td.enum,
.tnnc-table td.boolean {
  text-align: center;
}
.tnnc-table td.number {
  text-align: right;
}

.tnnc-fixed-column {
  position: sticky;
  z-index: 5;
  background: white;
}
.tnnc-table-footer {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}
.tnnc-table-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  align-items: center;
  padding: 10px 0;
}
.tnnc-table-toolbar .left,
.tnnc-table-toolbar .right {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: flex-start;
}
.tnnc-table-toolbar .right {
  justify-content: flex-end;
}
.tnnc-drop-down-table {
  width: 300px !important;
  display: flex;
  flex-direction: column;
}
.tnnc-drop-down-table > * {
  width: 100%;
}
.tnnc-group-row td {
  background: var(--tnnc-color-gray-light);
}
.tnnc-column-chooser.top {
  border-bottom-left-radius: 5px !important;
}
.tnnc-column-chooser.bottom {
  border-top-left-radius: 5px !important;
}
.tnnc-table-virtual-space {
  width: 1px;
  z-index: -1;
}
</style>
