import { ref } from 'vue';
import type {
  EditingStartEvent,
  EditigngStopEvent,
  EditigngSaveEvent,
  EditingDeleteEvent,
} from './useEditing.composable';
import type { ReorderingEvent } from './useRowDragging.composable';
import type { SelectionMode } from '@/components/TableComponent.vue';

export default function useSelection(
  mode: SelectionMode,
  emit: {
    <T>(e: 'startEditing', data: EditingStartEvent<T>): void;
    <T>(e: 'stopEditing', data: EditigngStopEvent<T>): void;
    <T>(e: 'saveRow', data: EditigngSaveEvent<T>): void;
    <T>(e: 'deleteRow', data: EditingDeleteEvent<T>): void;
    (e: 'reordering', data: ReorderingEvent): void;
    (e: 'selectionChanged', data: Set<string>): void;
  },
) {
  const selectedRowsIds = ref(new Set<string>());
  function toggleSelection(rowId: string) {
    if (selectedRowsIds.value.has(rowId)) {
      selectedRowsIds.value.delete(rowId);
    } else {
      if (mode === 'single') selectedRowsIds.value.clear();
      selectedRowsIds.value.add(rowId);
    }
    emit('selectionChanged', selectedRowsIds.value);
  }
  return { selectedRowsIds, toggleSelection };
}
