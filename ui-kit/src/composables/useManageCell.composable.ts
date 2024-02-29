import { computed, ref, type ComputedRef, type Ref } from 'vue';
import TableColumn from '../classes/table-column.class';
import ManageCell from '../components/secondary-components/ManageCell.vue';
import type { TableProps } from '@/components/TableComponent.vue';

export default function useManageCell(
  props: ComputedRef<TableProps>,
  groupedColumnIds: Ref<Set<string>>,
) {
  const hasManageCell = computed(
    () =>
      props.value.allowAdd ||
      props.value.allowDelete ||
      props.value.allowExpand ||
      props.value.allowEdit ||
      props.value.allowReordering ||
      props.value.allowSelection ||
      props.value.customManageButtons?.length ||
      groupedColumnIds.value.size > 0,
  );
  const manageCellWidth = ref(groupedColumnIds.value.size > 0 ? 300 : 100);
  const manageColumn = computed<TableColumn>(() => ({
    ...new TableColumn({
      columnType: 'manage',
      width: groupedColumnIds.value.size > 0 ? 300 : manageCellWidth.value,
      caption: props.value.manageColumnName || 'Элементы управления',
      templating: { cell: ManageCell, editor: ManageCell },
      name: 'manage-cell',
    }),
    id: 'manage_column',
    fixed: true,
    excludeFromColumnChooser: true,
  }));
  return { hasManageCell, manageCellWidth, manageColumn };
}
