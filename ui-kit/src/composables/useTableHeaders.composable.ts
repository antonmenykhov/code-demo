import { computed, type ComputedRef } from 'vue';
import type TableColumn from '../classes/table-column.class';

export default function useTableHeaders(
  columnsTree: ComputedRef<TableColumn[]>,
  cols: ComputedRef<TableColumn[]>,
) {
  const setMaxLevel = (columns: TableColumn[], level = 1) => {
    let maxLevel = level;
    columns.forEach((column) => {
      if (column.child?.length) {
        const childLevel = setMaxLevel(column.child, level + 1);
        if (childLevel > maxLevel) maxLevel = childLevel;
      }
    });
    return maxLevel;
  };

  const tableHeaders = computed(() => {
    const offsets: number[] = [];
    const headers: TableColumn[][] = [];
    const maxLevel = setMaxLevel(columnsTree.value);
    for (let i = 0; i < maxLevel; i++) {
      headers.push([]);
      offsets.push(0);
    }
    const setHeaders = (columns: TableColumn[], level = 0) => {
      let colspan = 0;
      let parentColspan = 0;
      columns.forEach((column) => {
        let rowspan = maxLevel - level;
        let width =
          cols.value.find((col) => col.id === column.id)?.width || column.width;
        if (column.child?.length) {
          colspan = setHeaders(column.child, level + 1);
          parentColspan += colspan;
          rowspan = 1;
          width = column.child.reduce((sum, child) => {
            const newSum = sum + child.width;
            return newSum;
          }, 0);
        } else if (column.rendered && !column.child?.length) {
          colspan = 1;
          parentColspan += 1;
        } else {
          colspan = 0;
        }
        if (colspan > 0) {
          headers[level].push({
            ...column,
            colspan,
            rowspan,
            offset: column.fixed ? offsets[level] : 0,
            width,
          });
        }
        if (column.fixed) {
          if (column.child.length === 0) {
            for (let i = level; i < offsets.length; i++) {
              offsets[i] += width;
            }
          } else {
            offsets[level] += width;
          }
        }
      });
      return parentColspan;
    };
    setHeaders(columnsTree.value);
    return headers;
  });
  return { tableHeaders };
}
