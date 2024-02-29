import TableColumn from '@/classes/table-column.class';
import type { CollapseTarget, Column } from '@/interfaces/column.interface';
import { ref, watch, type ComputedRef, type Ref } from 'vue';

export default function useColumnCustomization(
  columns: ComputedRef<Column[]>,
  initIsHeadersTiny: boolean,
) {
  function generateId(index: number, parentIndex?: string) {
    return parentIndex ? `${parentIndex}_${index}` : `${index}`;
  }

  // utils
  const generateColumns = (columnsArray: Column[], parentIndex?: string) =>
    columnsArray.map((column, index) => {
      const newColumn: TableColumn = new TableColumn(column);
      newColumn.id = generateId(index, parentIndex);
      if (newColumn.rendered) renderedColumnsIds.value.push(newColumn.id);
      if (newColumn.child.length) {
        newColumn.child = generateColumns(newColumn.child, newColumn.id);
      } else {
        defaultPlainColumns.value.push(column);
      }
      return newColumn;
    });

  const renderedColumnsIds: Ref<string[]> = ref([]);
  const collapsedColumnsIds = ref(new Set<string>());
  const fixedColumnIds = ref(new Set<string>());
  const defaultPlainColumns: Ref<Column[]> = ref([]);
  const columnTree = ref(generateColumns(columns.value));
  const customColumnWidths: Ref<{ columnId: string; width: number }[]> = ref(
    [],
  );
  const isAllCollapsed = ref(false);
  const groupedColumnIds = ref(new Set<string>());

  function toggleValue(valueSet: Ref<Set<string>>, value: string) {
    if (valueSet.value.has(value)) {
      valueSet.value.delete(value);
    } else {
      valueSet.value.add(value);
    }
  }
  function getTargetColumn(columnId: string): TableColumn {
    const idArr = columnId.split('_');
    let targetColumn = columnTree.value[+idArr[0]];
    for (let i = 1; i < idArr.length; i++) {
      targetColumn = targetColumn.child[+idArr[i]];
    }
    return targetColumn;
  }

  function getAllParent(columnId: string) {
    const columnIdArr = columnId.split('_');
    const parentColumns: string[] = [];
    for (let i = 0; i < columnId.length; i++) {
      parentColumns.push(columnIdArr.slice(0, i).join('_'));
    }
    return parentColumns;
  }

  function getAllChilds(columns: TableColumn[]) {
    const childColumnIds: string[] = [];
    columns.forEach((column) => {
      childColumnIds.push(column.id);
      if (column.child.length)
        childColumnIds.push(...getAllChilds(column.child));
    });
    return childColumnIds;
  }

  function hideColumn(columnId: string) {
    const targetColumn = getTargetColumn(columnId);
    const columnsForHide = [
      columnId,
      ...getAllChilds(targetColumn.child),
      ...getAllParent(columnId),
    ];
    renderedColumnsIds.value = renderedColumnsIds.value.filter(
      (item) => !columnsForHide.includes(item),
    );
  }

  // collapsing
  function getChildsForHidding(
    childColumns: TableColumn[],
    parentCollapseTarget: CollapseTarget,
    parentChildLength: number,
  ) {
    const childIdsForHidding: string[] = [];
    const childCollapsed: string[] = [];
    childColumns.forEach((column, index) => {
      let rendered = false;
      if (parentCollapseTarget === 'first') {
        rendered = index === 0;
      }
      if (parentCollapseTarget === 'last') {
        rendered = index === parentChildLength - 1;
      }
      if (typeof parentCollapseTarget === 'number') {
        rendered = index === parentCollapseTarget;
      }
      if (!rendered) childIdsForHidding.push(column.id);
      if (column.child.length > 0) childCollapsed.push(column.id);
      const {
        childIdsForHidding: hidingChild,
        childCollapsed: collspsedChild,
      } = getChildsForHidding(
        column.child,
        column.collapsing.collapseTarget,
        column.child.length,
      );
      childIdsForHidding.push(...hidingChild);
      childCollapsed.push(...collspsedChild);
    });
    return { childIdsForHidding, childCollapsed };
  }

  function toggleColumnCollapsing(columnId: string, collapse: boolean) {
    const targetColumn = getTargetColumn(columnId);
    const { childCollapsed, childIdsForHidding } = getChildsForHidding(
      targetColumn.child,
      targetColumn.collapsing.collapseTarget,
      targetColumn.child.length,
    );
    childIdsForHidding.push(columnId);
    let columnIdsForRender = renderedColumnsIds.value.filter(
      (item) => !childIdsForHidding.includes(item),
    );
    childCollapsed.forEach((child) => collapsedColumnsIds.value.add(child));
    if (!collapse) {
      columnIdsForRender = columnIdsForRender.concat(childIdsForHidding);
      childCollapsed.forEach((child) =>
        collapsedColumnsIds.value.delete(child),
      );
    }
    renderedColumnsIds.value = columnIdsForRender;
  }

  function toggleCollapsed(columnId: string) {
    toggleValue(collapsedColumnsIds, columnId);
    toggleColumnCollapsing(columnId, collapsedColumnsIds.value.has(columnId));
  }

  // fixing
  function toggleFixed(columnId: string) {
    toggleValue(fixedColumnIds, columnId);
  }

  function toggleFixedGroup(columnId: string) {
    const rootColumnId = +columnId.split('_')[0];
    const action = fixedColumnIds.value.has(columnId) ? 'delete' : 'add';
    for (let i = 0; i <= rootColumnId; i++) {
      fixedColumnIds.value[action](`${i}`);
    }
  }

  // resizing
  function setColumnWidth(id: string, width: number) {
    const existIndex = customColumnWidths.value.findIndex(
      (elem) => elem.columnId === id,
    );
    const customWidth = Math.max(50, width);
    if (existIndex === -1) {
      customColumnWidths.value.push({ columnId: id, width: customWidth });
    } else {
      customColumnWidths.value.splice(existIndex, 1, {
        columnId: id,
        width: customWidth,
      });
    }
  }

  function getColumnWidth(id: string, defaultWidth: number) {
    return (
      customColumnWidths.value.find((item) => item.columnId === id)?.width ||
      defaultWidth
    );
  }

  // grouping
  function toggleGrouping(columnId: string) {
    toggleValue(groupedColumnIds, columnId);
  }

  function ungroupAll() {
    groupedColumnIds.value.clear();
  }

  const isHeadersTiny = ref(initIsHeadersTiny);

  const isFilterVisible = ref(true);

  watch(columns, (newVal) => {
    renderedColumnsIds.value = [];
    defaultPlainColumns.value = [];
    columnTree.value = generateColumns(newVal);
  });
  watch(isAllCollapsed, (newVal) => {
    columnTree.value.forEach((column) => {
      if (column.collapsing.collapsable && column.child.length > 0)
        toggleColumnCollapsing(column.id, newVal);
    });
  });

  return {
    renderedColumnsIds,
    toggleCollapsed,
    toggleFixed,
    toggleFixedGroup,
    collapsedColumnsIds,
    fixedColumnIds,
    customColumnWidths,
    setColumnWidth,
    getColumnWidth,
    hideColumn,
    toggleGrouping,
    groupedColumnIds,
    ungroupAll,
    isHeadersTiny,
    isFilterVisible,
    isAllCollapsed,
    defaultPlainColumns,
  };
}
