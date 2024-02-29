import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { computed, ref, type ComputedRef, type Ref } from 'vue';

export default function useSorting(
  rows: ComputedRef<TableRow[]>,
  plainColumns: ComputedRef<TableColumn[]>,
) {
  const sortedColumns: Ref<
    { columnName: string; direction: 'asc' | 'desc' }[]
  > = ref([]);
  function setSorting(columnName: string, direction: 'asc' | 'desc') {
    const existIndex = sortedColumns.value.findIndex(
      (col) => columnName === col.columnName,
    );
    if (existIndex !== -1) {
      sortedColumns.value.splice(existIndex, 1, { columnName, direction });
    } else {
      sortedColumns.value.push({ columnName, direction });
    }
  }

  function removeSorting(columnName: string) {
    const existIndex = sortedColumns.value.findIndex(
      (col) => columnName === col.columnName,
    );
    if (existIndex !== -1) sortedColumns.value.splice(existIndex, 1);
  }

  function getValue(rowData: TableRow, columnName: string) {
    const sortedColumn = plainColumns.value.find(
      (column) => column.name === columnName,
    );
    if (sortedColumn?.columnType === 'number') {
      if (rowData[columnName] === '(Пусто)') return 0;
      return +`${rowData[columnName]}`.split(' ').join('');
    }
    if (sortedColumn?.columnType === 'date') {
      const value = (rowData[columnName] as string).split('.');
      if (value.length !== 3) return new Date('01.01.1970');
      value.splice(0, 1, value.splice(2, 1, value[0])[0]);
      return new Date(value.join('-'));
    }
    if (sortedColumn?.columnType === 'datetime') {
      const dateTimeArr = (rowData[columnName] as string).split(' ');
      if (dateTimeArr.length < 2) return new Date('01.01.1970');
      const dateValue = (dateTimeArr[0] as string).split('.');
      if (dateValue.length !== 3) return new Date('01.01.1970');
      dateValue.splice(0, 1, dateValue.splice(2, 1, dateValue[0])[0]);
      return new Date(`${dateValue.join('-')}T${dateTimeArr[1]}:00`);
    }
    if (sortedColumn?.columnType === 'computed') {
      const value = `${rowData[columnName]}`;
      if (value === '(Пусто)') return 0;
      const numbericValue = +`${rowData[columnName]}`.split(' ').join('');
      return isFinite(numbericValue) ? numbericValue : value;
    }
    if (
      (sortedColumn?.columnType === 'string' ||
        sortedColumn?.columnType === 'boolean' ||
        sortedColumn?.columnType === 'enum') &&
      rowData[columnName] === '(Пусто)'
    )
      return '';
    return rowData[columnName];
  }

  const sortedRows = computed(() => {
    return sortedColumns.value.length
      ? [...rows.value].sort((a, b) => {
          for (const column of sortedColumns.value) {
            const aValue = getValue(a, column.columnName);
            const bValue = getValue(b, column.columnName);
            if (aValue === null) return column.direction === 'asc' ? -1 : 1;
            if (bValue === null) return column.direction === 'asc' ? 1 : -1;
            if (aValue > bValue) return column.direction === 'asc' ? 1 : -1;
            if (aValue < bValue) return column.direction === 'asc' ? -1 : 1;
          }
          return 0;
        })
      : rows.value;
  });

  return { setSorting, sortedRows, removeSorting, sortedColumns };
}
