import type { TableRow } from '@/interfaces/table-row.interface';
import { ref, type ComputedRef, type Ref } from 'vue';
import type {
  EditingStartEvent,
  EditigngStopEvent,
  EditigngSaveEvent,
  EditingDeleteEvent,
} from './useEditing.composable';

export interface ReorderingEvent {
  oldIndex: number;
  newIndex: number;
}

export default function useRowDragging(
  rows: ComputedRef<TableRow[]>,
  emit: {
    <T>(e: 'startEditing', data: EditingStartEvent<T>): void;
    <T>(e: 'stopEditing', data: EditigngStopEvent<T>): void;
    <T>(e: 'saveRow', data: EditigngSaveEvent<T>): void;
    <T>(e: 'deleteRow', data: EditingDeleteEvent<T>): void;
    (e: 'reordering', data: ReorderingEvent): void;
    (e: 'selectionChanged', data: Set<string>): void;
  },
) {
  const currentDraggedRowId = ref('');
  const isDraggingNow = ref(false);
  const initMouseEvent: Ref<MouseEvent | null> = ref(null);
  let prevRow: HTMLElement | null = null;
  let prevIndex: string = '';
  function startDragging(
    rowId: string,
    mouseEvent: MouseEvent,
    initIndex: string,
  ) {
    currentDraggedRowId.value = rowId;
    initMouseEvent.value = mouseEvent;
    isDraggingNow.value = true;
    prevIndex = initIndex;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stopDragging);
  }
  function stopDragging() {
    isDraggingNow.value = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', stopDragging);
    if (prevRow) {
      prevRow.style.boxShadow = 'none';
      prevRow.style.zIndex = `1`;
      const index = prevRow.dataset.index;
      if (index)
        emit('reordering', {
          oldIndex: +prevIndex,
          newIndex: isNaN(+index) ? rows.value.length : +index,
        });
    }
  }
  function onMove(e: MouseEvent) {
    initMouseEvent.value = e;
    if (prevRow) {
      prevRow.style.boxShadow = 'none';
      prevRow.style.zIndex = `1`;
    }
    const tds = document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter((el) => el.tagName === 'TD');
    if (tds.length) {
      const currentRow = tds[0].closest(
        '.tnnc-table-row',
      ) as HTMLElement | null;
      if (currentRow) {
        prevRow = currentRow;
        currentRow.style.boxShadow = `0 -2px 2px var(--tnnc-color-blue)`;
        currentRow.style.zIndex = `5`;
      }
    }
  }
  return {
    startDragging,
    initMouseEvent,
    currentDraggedRowId,
    isDraggingNow,
    stopDragging,
  };
}
