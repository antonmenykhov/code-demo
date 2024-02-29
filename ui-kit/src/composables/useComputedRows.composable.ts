import type TableColumn from '@/classes/table-column.class';
import type { Meta } from '@/components/TableComponent.vue';
import type { Column, ColumnLookupType } from '@/interfaces/column.interface';
import type { TableRow } from '@/interfaces/table-row.interface';
import { isBoolean, isString, useDateFormat } from '@vueuse/core';
import { type ComputedRef, type Ref, computed } from 'vue';

export type ValueType = string | number | boolean | TableRow | TableRow[];

export default function useComputedRows(
  rawRows: ComputedRef<TableRow[]>,
  columns: Ref<Column[]>,
  numberFormatingEd: ComputedRef<number>,
  numberFormatingRazryad: ComputedRef<number>,
  meta: ComputedRef<Meta | undefined>,
  keyExpr: string,
  expandablePropertyName: string,
  hideZeroNumber: boolean | undefined,
) {
  function calcCellValue(column: Column, rowData: TableRow): string | number {
    const value = column.nestedValue
      ? column.name.split('.').reduce<any>((a, b) => a?.[b] || '', rowData)
      : rowData[column.name];
    if (column.formating?.disable) return `${value}`;
    if (
      (value === undefined ||
        value === null ||
        (value === 0 && hideZeroNumber) ||
        value === '') &&
      column.columnType !== 'computed' &&
      column.columnType !== 'computedText'
    )
      return '(Пусто)';
    if (column.columnType === 'boolean' && value !== null)
      return calcBooleanValue(column, value);
    if (column.columnType === 'date' && value !== null)
      return calcDateValue(value);
    if (column.columnType === 'datetime' && value !== null) {
      return calcDateTime(value);
    }
    if (
      column.columnType === 'number' &&
      (typeof value === 'number' || typeof value === 'string')
    )
      return `${formatNumberValue(+value)}`;
    if (
      column.columnType === 'computed' ||
      column.columnType === 'computedText'
    )
      return calcComputed(
        rowData,
        column,
        numberFormatingEd.value,
        numberFormatingRazryad.value,
        meta.value,
      );

    if (column.columnType === 'enum' && value !== null)
      return calcEnumValue(column, value);
    return `${value}`;
  }

  function calcBooleanValue(column: Column, value: ValueType) {
    if (isBoolean(value)) {
      if (column.trueValue && column.falseValue) {
        return value ? column.trueValue : column.falseValue;
      }
      return `${value}`;
    }
    return '(Пусто)';
  }

  function calcDateValue(value: ValueType) {
    if (isString(value)) {
      return useDateFormat(value, 'DD.MM.YYYY').value;
    }
    return `${value}`;
  }

  function calcDateTime(value: ValueType) {
    if (isString(value)) {
      const { value: foramtedDate } = useDateFormat(value, 'DD.MM.YYYY HH:mm');
      return foramtedDate;
    }
    return `${value}`;
  }

  function formatNumberValue(value: number) {
    function getFromated(value: string) {
      const [_, num, suffix] = value.match(
        /^(.*?)((?:[,.]\d+)?|)$/,
      ) as RegExpMatchArray;
      return `${num.replace(/\B(?=(?:\d{3})*$)/g, ' ')}${suffix}`;
    }
    return getFromated(
      `${(value * numberFormatingEd.value).toFixed(
        numberFormatingRazryad.value,
      )}`,
    );
  }

  function calcEnumValue(column: Column, value: ValueType): string {
    if (
      column.lookup &&
      column.lookup.valueExpr !== column.lookup.displayExpr
    ) {
      const existingItem = column.lookup.handbook.find(
        (item) =>
          item[(column.lookup as ColumnLookupType<any>).valueExpr] === value,
      );
      return (existingItem?.[column.lookup.displayExpr] as string) || '(Пусто)';
    }
    return `${value}`;
  }

  function calcComputed(
    rowData: TableRow,
    column: Column,
    numberFormatingEd: number,
    numberFormatingRazryad: number,
    meta?: Meta,
  ) {
    if (column.computing?.value)
      return column.computing.value(
        rowData,
        column,
        numberFormatingEd,
        numberFormatingRazryad,
        meta,
      );
    return '(Пусто)';
  }

  function calcRow(rowData: TableRow, index: number): TableRow {
    const computedRow: TableRow = {} as TableRow;
    columns.value.forEach(
      (column) => (computedRow[column.name] = calcCellValue(column, rowData)),
    );
    computedRow[keyExpr] = rowData[keyExpr];
    computedRow[expandablePropertyName] = rowData[expandablePropertyName];
    computedRow['_index'] = index;
    computedRow['_rawRow'] = rowData;
    computedRow['_rowCssClass'] = rowData['_rowCssClass'] || '';
    return computedRow;
  }

  const computedRows = computed(() => {
    return rawRows.value.map(calcRow);
  });

  return { computedRows };
}
