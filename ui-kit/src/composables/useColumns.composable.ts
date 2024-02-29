import { computed, ref, type ComputedRef, type Ref } from 'vue';
import TableColumn from '../classes/table-column.class';
import type { Column } from '../interfaces/column.interface';
import useManageCell from './useManageCell.composable';
import type { TableProps } from '@/components/TableComponent.vue';

export default function useGenerateColumnsForTable(
  props: ComputedRef<TableProps>,
  renderedColumnsIds: Ref<string[]>,
  fixedColumnIds: Ref<Set<string>>,
  collapsedColumnsIds: Ref<Set<string>>,
  groupedColumnIds: Ref<Set<string>>,
) {
  const { hasManageCell, manageColumn } = useManageCell(
    props,
    groupedColumnIds,
  );

  // генератор id
  function generateId(index: number, parentIndex?: string) {
    return parentIndex ? `${parentIndex}_${index}` : `${index}`;
  }

  // Древовидная структура столбцов с индексами и порядковыми номерами и маппиногом стейта
  const tableColumnsTree = computed<TableColumn[]>(() => {
    let columnNumber = 0;
    const generateColumns = (
      columnsArray: Partial<Column>[],
      parentIndex?: string,
      parentFixed = false,
    ) =>
      columnsArray.map((column, index) => {
        const newColumn: TableColumn = new TableColumn(column);
        newColumn.id = generateId(index, parentIndex);
        if (parentFixed || fixedColumnIds.value.has(newColumn.id))
          newColumn.fixed = true;
        newColumn.collapsing.collapsed = collapsedColumnsIds.value.has(
          newColumn.id,
        );
        newColumn.rendered = renderedColumnsIds.value.includes(newColumn.id);

        // Рекурсивно для чайлдов
        if (newColumn.child.length) {
          newColumn.child = generateColumns(
            newColumn.child,
            newColumn.id,
            newColumn.fixed,
          );
        } else {
          newColumn.number = ++columnNumber;
        }
        return newColumn;
      });
    const tableColumnsArray = generateColumns(props.value.columns);
    if (hasManageCell.value) {
      tableColumnsArray.unshift(manageColumn.value);
    }
    return tableColumnsArray;
  });

  // Все столбцы(без joined) в одноуровневом массиве, с вычисленным offset у фиксированных
  const tableColumnsPlain = computed<TableColumn[]>(() => {
    let offset = 0;
    const getColumnsPlain = (columns: TableColumn[]) => {
      const newColumnsArray: TableColumn[] = [];
      columns.forEach((column) => {
        const newColumn = { ...column };
        if (newColumn.child?.length) {
          newColumnsArray.push(...getColumnsPlain(newColumn.child));
        } else {
          if (newColumn.fixed) {
            newColumn.offset = offset;
            offset += newColumn.width;
          }
          newColumnsArray.push(newColumn);
        }
      });
      return newColumnsArray;
    };
    return getColumnsPlain(tableColumnsTree.value);
  });

  // Столбцы для рендера
  const tableColumnsForRender = computed<TableColumn[]>(() =>
    tableColumnsPlain.value.filter((column) => column.rendered),
  );
  return {
    tableColumnsForRender,
    tableColumnsTree,
    tableColumnsPlain,
  };
}
