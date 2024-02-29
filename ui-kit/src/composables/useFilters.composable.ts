import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { useThrottle } from '@vueuse/core';
import { computed, ref, type ComputedRef, type Ref } from 'vue';

export type FilterType = 'equals' | 'between' | 'gt' | 'lt';
export type FilterValue = {
  columnName: string;
  filterType: FilterType;
  filterSet: Set<string | number>;
};

export type FilterCollection = {
  columnName: string;
  collection: Set<string | number>;
};

export default function useFilters(
  columns: ComputedRef<TableColumn[]>,
  rows: Ref<TableRow[]>,
) {
  const currentFilter: Ref<FilterValue[]> = ref([]);
  const filterThrottled = useThrottle(currentFilter, 100);
  const currentFilteredColumnNames = computed(() => {
    const columnIdsSet = new Set<string>();
    filterThrottled.value.forEach((filterValue) => {
      columnIdsSet.add(filterValue.columnName);
    });
    return columnIdsSet;
  });
  const filterCollection: Ref<FilterCollection[]> = computed(() => {
    return columns.value.map((column) => {
      const collection = new Set<string | number>();
      const columnName = column.name;
      filteredRows.value.forEach((row) => {
        collection.add(row[column.name] as string | number);
      });
      return { collection, columnName };
    });
  });

  function checkColumnFilter(row: TableRow, columnName: string) {
    const column = columns.value.find(
      (col) => col.name === columnName,
    ) as TableColumn;

    const filterValue = filterThrottled.value.find(
      (value) => value.columnName === columnName,
    );
    let checkResult = true;
    if (filterValue) {
      const filterSetArray = Array.from(filterValue.filterSet);
      switch (filterValue.filterType) {
        case 'equals': {
          checkResult =
            column.columnType === 'number' || column.columnType === 'computed'
              ? getValue(row[columnName], column) ===
                getValue(filterSetArray[0], column)
              : filterValue.filterSet.has(row[columnName] as string | number);
          break;
        }
        case 'gt': {
          checkResult =
            filterSetArray.length === 1
              ? getValue(row[columnName], column) >
                getValue(filterSetArray[0], column)
              : true;
          break;
        }
        case 'lt': {
          checkResult =
            filterSetArray.length === 1
              ? getValue(row[columnName], column) <
                getValue(filterSetArray[0], column)
              : true;
          break;
        }
        default: {
          throw `Unknown FilterType: ${filterValue.filterType}`;
        }
      }
    }
    return checkResult;
  }

  function checkRowFilter(row: TableRow) {
    const filteredColumnNamesArray = Array.from(
      currentFilteredColumnNames.value,
    );
    for (let i = 0; i < filteredColumnNamesArray.length; i++) {
      const columnResult = checkColumnFilter(row, filteredColumnNamesArray[i]);
      if (!columnResult) return columnResult;
    }
    return true;
  }

  function clearFilter() {
    currentFilter.value = [];
  }

  const filteredRows = computed(() =>
    rows.value.filter((row) => checkRowFilter(row)),
  );
  function getValue(rawValue: any, column: TableColumn) {
    if (column.columnType === 'number') {
      if (rawValue === '(Пусто)') return 0;
      return +`${rawValue}`.split(' ').join('');
    }
    if (column.columnType === 'date') {
      const value = (rawValue as string).split('.');
      if (value.length !== 3) return new Date('01.01.1970');
      value.splice(0, 1, value.splice(1, 1, value[0])[0]);
      return new Date(value.join('.'));
    }
    if (column.columnType === 'datetime') {
      const dateTimeArr = (rawValue as string).split(' ');

      if (dateTimeArr.length < 2) return new Date('01.01.1970');
      const dateValue = (dateTimeArr[0] as string).split('.');
      if (dateValue.length !== 3) return new Date('01.01.1970');
      dateValue.splice(0, 1, dateValue.splice(2, 1, dateValue[0])[0]);
      return new Date(`${dateValue.join('-')}T${dateTimeArr[1]}:00`);
    }
    if (column.columnType === 'computed') {
      const value = `${rawValue}`;
      if (value === '(Пусто)') return 0;
      const numbericValue = +`${rawValue}`.split(' ').join('');
      return isFinite(numbericValue) ? numbericValue : value;
    }
    return rawValue;
  }

  return { filterCollection, currentFilter, filteredRows, clearFilter };
}
