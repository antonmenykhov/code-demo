import TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { useElementBounding, useScroll, useThrottle } from '@vueuse/core';
import {
  computed,
  watch,
  type ComputedRef,
  type Ref,
  onMounted,
  nextTick,
} from 'vue';

export default function useVirtualScroll(
  tableWrapper: Ref<null | HTMLElement>,
  tableColumnsForRender: ComputedRef<TableColumn[]>,
  currentRowSet: ComputedRef<TableRow[]>,
  defaultRowHeight: number,
) {
  const { x, y } = useScroll(tableWrapper);
  const { width, height } = useElementBounding(tableWrapper);

  const throttledX = useThrottle(x, 50);
  const tableBodyRenderParams = computed(() => {
    const columns: TableColumn[] = [];
    let fullWidthOfColumnSet = 0;
    const widthOfViewPort = width.value;
    const scrollPosition = throttledX.value;
    function addColspan(column: TableColumn) {
      const lastColumnIndex = columns.length - 1;
      if (
        lastColumnIndex !== -1 &&
        columns[lastColumnIndex].columnType === 'colspan'
      ) {
        columns[lastColumnIndex].colspan += 1;
      } else {
        const newColspanColumn = new TableColumn(column);
        newColspanColumn.name = `${column.name}_colspan`;
        newColspanColumn.id = `${column.id}_colspan`;
        newColspanColumn.columnType = 'colspan';
        columns.push(newColspanColumn);
      }
    }
    tableColumnsForRender.value.forEach((column) => {
      if (column.fixed) {
        columns.push(column);
        fullWidthOfColumnSet += column.width;
        return;
      }
      if (
        fullWidthOfColumnSet - 500 < widthOfViewPort + scrollPosition &&
        fullWidthOfColumnSet + 500 > scrollPosition
      ) {
        columns.push(column);
      } else {
        addColspan(column);
      }
      fullWidthOfColumnSet += column.width;
    });
    return {
      columns,
    };
  });

  const virtualTableHeight = computed(
    () => currentRowSet.value.length * defaultRowHeight,
  );

  const scrollPercent = computed(() => {
    return Math.min(y.value / (virtualTableHeight.value - height.value), 1);
  });
  const firstRowForRender = computed(() =>
    Math.min(
      currentRowSet.value.length - rowsCountForRender.value,
      Math.ceil(scrollPercent.value * currentRowSet.value.length),
    ),
  );

  const rowsCountForRender = computed(
    () => Math.ceil(height.value / defaultRowHeight) + 5,
  );

  const renderedRows = computed(() =>
    rowsCountForRender.value + 5 > currentRowSet.value.length
      ? currentRowSet.value
      : currentRowSet.value.slice(
          firstRowForRender.value,
          firstRowForRender.value + rowsCountForRender.value,
        ),
  );
  const topOffset = computed(() =>
    Math.max(
      0,
      renderedRows.value.length === currentRowSet.value.length
        ? 0
        : (firstRowForRender.value - 10) * defaultRowHeight -
            height.value *
              (firstRowForRender.value / currentRowSet.value.length),
    ),
  );
  const bottomOffset = computed(() =>
    renderedRows.value.length === currentRowSet.value.length
      ? 0
      : virtualTableHeight.value -
        topOffset.value -
        (renderedRows.value.length + 10) * defaultRowHeight -
        height.value * scrollPercent.value,
  );

  onMounted(() => {
    if (tableWrapper.value?.closest('.tnnc-popup-content')) {
      setTimeout(() => {
        y.value = 10;
        setTimeout(() => {
          y.value = 0;
        }, 100);
      });
    }
  });
  return {
    tableBodyRenderParams,
    virtualTableHeight,
    renderedRows,
    topOffset,
    bottomOffset,
  };
}
