import { computed, watch, type ComputedRef, type Ref } from 'vue';
import type { FilterType, FilterValue } from './useFilters.composable';

export type TableSettings = {
  renderedColumnsIds: string[];
  collapsedColumnsIds: string[];
  fixedColumnIds: string[];
  customColumnWidths: {
    columnId: string;
    width: number;
  }[];
  groupedColumnIds: string[];
  expandedGroupNames: string[];
  currentPage: number;
  pageSize: number;
  expandedRows: string[];
  masterDetailOpened: string[];
  editingRowIds: string[];
  selectedRowsIds: string[];
  currentFilter: Array<{
    filterSet: Array<string | number>;
    columnName: string;
    filterType: FilterType;
  }>;
  sortedColumns: {
    columnName: string;
    direction: 'asc' | 'desc';
  }[];
};

export default function useTableSettings(
  renderedColumnsIds: Ref<string[]>,
  collapsedColumnsIds: Ref<Set<string>>,
  fixedColumnIds: Ref<Set<string>>,
  customColumnWidths: Ref<
    {
      columnId: string;
      width: number;
    }[]
  >,
  groupedColumnIds: Ref<Set<string>>,
  expandedGroupNames: Ref<Set<string>>,
  currentPage: Ref<number>,
  pageSize: Ref<number>,
  expandedRows: Ref<Set<string>>,
  masterDetailOpened: Ref<Set<string>>,
  editingRowIds: Ref<Set<string>>,
  selectedRowsIds: Ref<Set<string>>,
  currentFilter: Ref<FilterValue[]>,
  sortedColumns: Ref<
    {
      columnName: string;
      direction: 'asc' | 'desc';
    }[]
  >,
  emit: { (e: 'settingsChanged', data: TableSettings): void },
) {
  const tableSettings: ComputedRef<TableSettings> = computed(() => ({
    renderedColumnsIds: Array.from(renderedColumnsIds.value),
    collapsedColumnsIds: Array.from(collapsedColumnsIds.value),
    fixedColumnIds: Array.from(fixedColumnIds.value),
    customColumnWidths: Array.from(customColumnWidths.value),
    groupedColumnIds: Array.from(groupedColumnIds.value),
    expandedGroupNames: Array.from(expandedGroupNames.value),
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    expandedRows: Array.from(expandedRows.value),
    masterDetailOpened: Array.from(masterDetailOpened.value),
    editingRowIds: Array.from(editingRowIds.value),
    selectedRowsIds: Array.from(selectedRowsIds.value),
    currentFilter: Array.from(currentFilter.value).map((item) => ({
      ...item,
      filterSet: Array.from(item.filterSet),
    })),
    sortedColumns: sortedColumns.value.map((val) =>
      JSON.parse(JSON.stringify(val)),
    ),
  }));
  watch(
    tableSettings,
    () => {
      emitTableSettings();
    },
    { deep: true },
  );
  function emitTableSettings() {
    emit('settingsChanged', tableSettings.value);
  }

  function setSettings(settings: Partial<TableSettings>) {
    if (settings.renderedColumnsIds)
      renderedColumnsIds.value = settings.renderedColumnsIds;
    if (settings.customColumnWidths)
      customColumnWidths.value = settings.customColumnWidths;
    if (settings.collapsedColumnsIds)
      collapsedColumnsIds.value = new Set(settings.collapsedColumnsIds);
    if (settings.fixedColumnIds)
      fixedColumnIds.value = new Set(settings.fixedColumnIds);
    if (settings.groupedColumnIds)
      groupedColumnIds.value = new Set(settings.groupedColumnIds);
    if (settings.currentFilter)
      currentFilter.value = settings.currentFilter.map((item) => ({
        ...item,
        filterSet: new Set(item.filterSet),
      }));
    if (settings.pageSize) pageSize.value = settings.pageSize;
    if (settings.currentPage) currentPage.value = settings.currentPage;

    if (settings.editingRowIds)
      editingRowIds.value = new Set(settings.editingRowIds);
    if (settings.expandedGroupNames)
      expandedGroupNames.value = new Set(settings.expandedGroupNames);
    if (settings.expandedRows)
      expandedRows.value = new Set(settings.expandedRows);
    if (settings.masterDetailOpened)
      masterDetailOpened.value = new Set(settings.masterDetailOpened);
    if (settings.selectedRowsIds)
      selectedRowsIds.value = new Set(settings.selectedRowsIds);
    if (settings.sortedColumns) sortedColumns.value = settings.sortedColumns;
  }

  return { setSettings, tableSettings };
}
