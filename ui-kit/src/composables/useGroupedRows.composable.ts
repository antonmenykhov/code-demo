import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';

export default function useGroupedRows(
  rows: ComputedRef<TableRow[]>,
  plainColumns: ComputedRef<TableColumn[]>,
  groupedColumnIds: Ref<Set<string>>,
  numberFormatingEd: ComputedRef<number>,
  numberFormatingRazryad: ComputedRef<number>,
  keyExpr: string,
  propsComputed: ComputedRef<{
    groupRowsDefaultStateOpened?: boolean;
    showGroupCounter?: boolean;
    hideZeroNumbers?: boolean;
  }>,
) {
  const expandedGroupNames = ref(new Set<string>());
  watch(groupedColumnIds.value, () => expandedGroupNames.value.clear());
  function toggleExpandedGroupNames(groupName: string) {
    if (expandedGroupNames.value.has(groupName)) {
      expandedGroupNames.value.delete(groupName);
    } else {
      expandedGroupNames.value.add(groupName);
    }
  }

  function getNumericValue(value: string) {
    if (value === '(Пусто)') return 0;
    const numbericValue = +value.split(' ').join('');
    return isFinite(numbericValue) ? numbericValue : 0;
  }

  function formatNumberValue(value: number) {
    if (value === 0 && propsComputed.value.hideZeroNumbers) return '(Пусто)';
    function getFromated(value: string) {
      const [_, num, suffix] = value.match(
        /^(.*?)((?:[,.]\d+)?|)$/,
      ) as RegExpMatchArray;
      return `${num.replace(/\B(?=(?:\d{3})*$)/g, ' ')}${suffix}`;
    }
    return getFromated(`${(value * 1).toFixed(numberFormatingRazryad.value)}`);
  }

  //Выдает строку - группу. Считает суммы по всем числовым значениям
  const getGroupRow = (
    rows: TableRow[],
    key: string,
    group: string,
    index: number,
  ): TableRow => {
    const col = plainColumns.value.find((col) => col.name === key);
    const caption = col?.caption || '';
    const val = group ? group : '(Пусто)';
    const groupRow: TableRow = {
      _name: propsComputed.value.showGroupCounter
        ? `${caption}: ${val} (${
            rows.filter((row) => row[key] === group).length
          })`
        : `${caption}: ${val} `,
      _groupedElements: rows.filter((row) => row[key] === group),
      _groupedColumnId: col?.id || '',
      _level: index,
      _rowCssClass: 'tnnc-group-row',
      _rawRow: {} as TableRow,
    };
    plainColumns.value.forEach((column) => {
      if (
        (column.columnType === 'number' || column.columnType === 'computed') &&
        !column.excludeFromTotals
      ) {
        groupRow[column.name] = formatNumberValue(
          column.computing?.grouping
            ? column.computing.grouping(groupRow._groupedElements, column)
            : groupRow._groupedElements?.reduce(
                (summ: number, row: TableRow) => {
                  summ += getNumericValue(`${row[column.name]}`);
                  return summ;
                },
                0,
              ),
        );
      }
    });
    return groupRow;
  };

  //рекурсивно сгруппировать строки пока не закочнится grouepdColumns
  const groupRows = (
    rows: TableRow[],
    groupedColumns: string[],
    index: number,
    expandedGroups: Set<string>,
    parentUUID: string,
  ): TableRow[] => {
    const groups = new Set<string>();
    const key = plainColumns.value.find(
      (col) => col.id === groupedColumns[index],
    )?.name as string;
    const isLast = index + 1 === groupedColumns.length;
    rows.forEach((row) => {
      groups.add(`${row[key]}`);
    });
    const additionalRowsIndexes: number[] = [];
    const groupedRows: TableRow[] = Array.from(groups)
      .sort()
      .map((group, groupIndex) => {
        const rowGroup = getGroupRow(rows, key, group, index);
        rowGroup._UUID = `${parentUUID}_${index}_${groupIndex}`;
        rowGroup[keyExpr] = rowGroup._UUID;
        if (
          (propsComputed.value.groupRowsDefaultStateOpened &&
            !expandedGroups.has(rowGroup._UUID)) ||
          (!propsComputed.value.groupRowsDefaultStateOpened &&
            expandedGroups.has(rowGroup._UUID))
        ) {
          rowGroup.expanded = true;
          additionalRowsIndexes.push(groupIndex);
        }
        if (!isLast) {
          rowGroup._groupedElements = groupRows(
            rowGroup._groupedElements,
            groupedColumns,
            index + 1,
            expandedGroups,
            rowGroup._UUID,
          );
        }
        return rowGroup;
      });
    let deltaIndex = 0;
    additionalRowsIndexes.forEach((groupIndex) => {
      groupedRows.splice(
        groupIndex + deltaIndex + 1,
        0,
        ...groupedRows[groupIndex + deltaIndex]._groupedElements,
      );
      deltaIndex +=
        groupedRows[groupIndex + deltaIndex]._groupedElements.length;
    });
    return groupedRows;
  };

  const groupedRows = computed(() => {
    return groupedColumnIds.value.size > 0
      ? groupRows(
          rows.value,
          Array.from(groupedColumnIds.value),
          0,
          expandedGroupNames.value,
          '',
        )
      : rows.value;
  });
  return { groupedRows, toggleExpandedGroupNames, expandedGroupNames };
}
