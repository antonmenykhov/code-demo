import type TableColumn from '@/classes/table-column.class';
import type { Column } from '@/interfaces/column.interface';
import { useElementBounding } from '@vueuse/core';
import {
  computed,
  ref,
  type ComputedRef,
  type Ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';

export default function useColumnWidths(
  defaulPlainColumns: Ref<Partial<Column>[]>,
  renderedColumns: ComputedRef<TableColumn[]>,
  getColumnWidth: (id: string, defaultWidth: number) => number,
  tableWrapper: Ref<null | HTMLElement>,
) {
  const { width } = useElementBounding(tableWrapper);
  const fullColgroupWidth = computed(() =>
    renderedColumns.value.reduce((acc, col) => {
      return (acc += col.width);
    }, 0),
  );
  const clickCounter = ref(0);
  function incrementcClick() {
    clickCounter.value++;
  }
  onMounted(() => {
    if (tableWrapper.value) {
      tableWrapper.value.addEventListener('click', incrementcClick);
    }
  });
  onBeforeUnmount(() => {
    if (tableWrapper.value) {
      tableWrapper.value.removeEventListener('click', incrementcClick);
    }
  });

  const hasVerticalScroll = computed(() => {
    if (tableWrapper.value && clickCounter.value > -1) {
      return tableWrapper.value.scrollHeight > tableWrapper.value.clientHeight;
    }

    return false;
  });
  const defaultColumnsWithoutWidthCount = computed(() =>
    defaulPlainColumns.value.reduce((acc, col) => {
      if (col.width === undefined || col.width === null) acc++;
      return acc;
    }, 0),
  );
  const deltaWidth = computed(
    () =>
      width.value -
      fullColgroupWidth.value -
      20 -
      (hasVerticalScroll.value ? 20 : 0),
  );

  function getColumnWidthComplex(column: TableColumn) {
    if (deltaWidth.value > 0 && defaultColumnsWithoutWidthCount.value > 0) {
      const calcedWidth = getColumnWidth(column.id, 0);
      const defaultColumn = defaulPlainColumns.value.find(
        (col) => col.name === column.name,
      );
      let newWidth = 100;
      if (calcedWidth !== 0) newWidth = calcedWidth;
      if (
        calcedWidth === 0 &&
        defaultColumn &&
        (defaultColumn.width === undefined || defaultColumn.width === null)
      )
        newWidth +=
          Math.ceil(deltaWidth.value / defaultColumnsWithoutWidthCount.value) -
          1;
      if (defaultColumn?.width) newWidth = defaultColumn?.width;
      if (column.columnType === 'manage')
        newWidth = getColumnWidth('manage_column', column.width);

      return newWidth;
    }
    return getColumnWidth(column.id, column.width);
  }

  const cols = computed(() => {
    let offset = 0;
    return renderedColumns.value.map((col) => {
      const newColumn = { ...col };
      newColumn.width = getColumnWidthComplex(col);
      if (newColumn.fixed) {
        newColumn.offset = offset;
        offset += newColumn.width;
      }
      return newColumn;
    });
  });
  return { cols };
}
