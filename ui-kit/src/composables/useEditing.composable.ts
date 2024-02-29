import type { TableRow } from '@/interfaces/table-row.interface';
import { ref, type ComputedRef, type Ref } from 'vue';
import type { ReorderingEvent } from './useRowDragging.composable';

export interface EditingStartEvent<T> {
  row: T;
  stop: () => void;
}

export interface EditigngStopEvent<T> {
  row: T;
  start: () => void;
}

export interface EditigngSaveEvent<T> {
  isNew: boolean;
  row: T;
  diff: Partial<T>;
  closeEditor: () => void;
}

export interface EditingDeleteEvent<T> {
  row: T;
}

export default function useEditing(
  rows: ComputedRef<TableRow[]>,
  keyExpr: string,
  emit: {
    <T>(e: 'startEditing', data: EditingStartEvent<T>): void;
    <T>(e: 'stopEditing', data: EditigngStopEvent<T>): void;
    <T>(e: 'saveRow', data: EditigngSaveEvent<T>): void;
    <T>(e: 'deleteRow', data: EditingDeleteEvent<T>): void;
    (e: 'reordering', data: ReorderingEvent): void;
    (e: 'selectionChanged', data: Set<string>): void;
  },
  table: Ref<null | HTMLElement>,
  autosaveRow?: boolean,
) {
  const editingRowIds = ref(new Set<string>());
  function getRowId(rowData: TableRow) {
    return `${rowData[keyExpr]}`;
  }
  function startEditing(rowData: TableRow) {
    if (autosaveRow) saveAllRows();
    editingRowIds.value.add(getRowId(rowData));
    emit('startEditing', { row: rowData, stop: () => stopEditing(rowData) });
  }
  function stopEditing(rowData: TableRow) {
    editingRowIds.value.delete(getRowId(rowData));
    emit('stopEditing', { row: rowData, start: () => startEditing(rowData) });
  }
  function saveRow(rowData: TableRow, diff: TableRow) {
    emit('saveRow', {
      isNew: rowData[keyExpr] === 'new',
      row: { ...rowData, 'manage-cell': undefined },
      diff,
      closeEditor: () => stopEditing(rowData),
    });
  }
  function deleteRow(rowData: TableRow) {
    emit('deleteRow', { row: rowData });
  }
  function addNewRow() {
    emit('startEditing', {
      row: { [keyExpr]: 'new' },
      // @ts-ignore
      stop: () => stopEditing({ id: 'new' }),
    });
    editingRowIds.value.add('new');
  }
  function saveAllRows(excludeList?: string[]) {
    if (table) {
      Array.from(editingRowIds.value).forEach((value) => {
        if (!excludeList || !excludeList.includes(value)) {
          table.value?.dispatchEvent(
            new CustomEvent(`tnnc-table-save-row-${value}`),
          );
        }
      });
    }
  }
  return {
    editingRowIds,
    startEditing,
    stopEditing,
    saveRow,
    deleteRow,
    addNewRow,
    saveAllRows,
  };
}
