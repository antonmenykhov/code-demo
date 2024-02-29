<template>
  <ContextMenu
    v-if="visible"
    :mouseEvent="mouseEvent"
    @clickOutside="() => emit('update:visible', false)"
  >
    <div class="tnnc-context-menu-content" v-if="targetType === 'header'">
      <button
        v-if="tableProps.allowFixing"
        class="tnnc-contex-menu-btn"
        @click.prevent="toggleFixed"
      >
        {{ columnParams.fixed ? 'Открепить' : 'Закрепить' }}
      </button>
      <button
        v-if="tableProps.allowFixing"
        class="tnnc-contex-menu-btn"
        @click.prevent="toggleFixedGroup"
      >
        {{ columnParams.fixed ? 'Открепить область' : 'Закрепить область' }}
      </button>
      <button
        v-if="columnParams.collapsable"
        class="tnnc-contex-menu-btn"
        @click.prevent="toggleColapsed"
      >
        {{ columnParams.collapsed ? 'Развернуть' : 'Свернуть' }}
      </button>
      <button
        v-if="
          columnParams.sortable &&
          columnParams.sortDirection !== 'asc' &&
          tableProps.allowSorting
        "
        class="tnnc-contex-menu-btn"
        @click.prevent="() => setSorting('asc')"
      >
        Сортировать по возрастанию
      </button>
      <button
        v-if="
          columnParams.sortable &&
          columnParams.sortDirection !== 'desc' &&
          tableProps.allowSorting
        "
        class="tnnc-contex-menu-btn"
        @click.prevent="() => setSorting('desc')"
      >
        Сортировать по убыванию
      </button>
      <button
        v-if="
          columnParams.sortable &&
          columnParams.sortDirection !== '' &&
          tableProps.allowSorting
        "
        class="tnnc-contex-menu-btn"
        @click.prevent="removeSorting"
      >
        Удалить сортировку
      </button>
      <button
        v-if="tableProps.columnChooser"
        class="tnnc-contex-menu-btn"
        @click.prevent="hideColumn"
      >
        Скрыть столбец
      </button>
      <button
        v-if="
          columnParams.columnType !== 'manage' &&
          columnParams.columnType !== 'joined' &&
          tableProps.allowGrouping
        "
        class="tnnc-contex-menu-btn"
        @click.prevent="toggleGrouping"
      >
        {{ columnParams.grouped ? 'Разгруппировать' : 'Сгруппировать' }}
      </button>
      <button
        v-if="
          tableProps.allowGrouping &&
          columnParams.grouped &&
          columnParams.columnType !== 'manage' &&
          columnParams.columnType !== 'joined'
        "
        class="tnnc-contex-menu-btn"
        @click.prevent="ungroupAll"
      >
        Разгруппировать все
      </button>
    </div>
    <div class="tnnc-context-menu-content" v-else>
      <button
        v-if="tableProps.allowGrouping"
        class="tnnc-contex-menu-btn"
        @click.prevent="toggleGrouping"
      >
        Разгруппировать
      </button>
      <button
        v-if="tableProps.allowGrouping"
        class="tnnc-contex-menu-btn"
        @click.prevent="ungroupAll"
      >
        Разгруппировать все
      </button>
    </div>
  </ContextMenu>
</template>
<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue';
import ContextMenu from '../ContextMenu.vue';

const targetType = computed(() => {
  const target = props.mouseEvent.target as HTMLElement;
  if (target.closest('.tnnc-group-header')) return 'manage-cell';
  return 'header';
});

const manageCellParams = computed(() => {
  let columnId = '';
  const target = (props.mouseEvent.target as HTMLElement).closest(
    '.tnnc-group-header',
  ) as HTMLElement;
  if (target) {
    columnId = target.dataset.columnid as string;
  }
  return { columnId };
});

const props = defineProps<{
  mouseEvent: MouseEvent;
  visible: boolean;
  tableProps: {
    allowGrouping: boolean;
    allowSorting: boolean;
    allowFixing: boolean;
    columnChooser: boolean;
  };
}>();
const emit = defineEmits<{ (e: 'update:visible', data: boolean): void }>();
const columnParams = computed(() => {
  let fixed = false;
  let id = '';
  let collapsable = false;
  let collapsed = false;
  let sortable = false;
  let grouped = false;
  let name = '';
  let columnType = '';
  let sortDirection = '';
  const target = (props.mouseEvent.target as HTMLElement).closest('th');
  if (target) {
    fixed = target.dataset.fixed === 'true';
    id = target.dataset.id as string;
    collapsable = target.dataset.collapsable === 'true';
    collapsed = target.dataset.collapsed === 'true';
    sortable = target.dataset.sortable === 'true';
    name = target.dataset.name as string;
    grouped = target.dataset.grouped === 'true';
    columnType = target.dataset.type as string;
    sortDirection = (target.dataset.sortDirection as 'asc' | 'desc') || '';
  }
  return {
    fixed,
    id,
    collapsable,
    collapsed,
    sortable,
    name,
    grouped,
    columnType,
    sortDirection,
  };
});
const toggleFixedInjected = inject('toggleFixed') as (columnId: string) => void;
const toggleFixedGroupInjected = inject('toggleFixedGroup') as (
  columnId: string,
) => void;
const toggleColapsedInjected = inject('toggleCollapsed') as (
  columnId: string,
) => void;
const setSortingInjected = inject('setSorting') as (
  columnName: string,
  direction: 'asc' | 'desc',
) => void;
const sortedColumns = inject('sortedColumns') as Ref<
  { columnName: string; direction: 'asc' | 'desc' }[]
>;
const removeSortingInjected = inject('removeSorting') as (
  columnName: string,
) => void;
const hideColumnInjected = inject('hideColumn') as (columnId: string) => void;
const toggleGroupingInjected = inject('toggleGrouping') as (
  columnId: string,
) => void;
const ungroupAllInjected = inject('ungroupAll') as () => void;
function toggleFixed() {
  toggleFixedInjected(columnParams.value.id.split('_')[0]);
  emit('update:visible', false);
}
function toggleFixedGroup() {
  toggleFixedGroupInjected(columnParams.value.id.split('_')[0]);
  emit('update:visible', false);
}
function toggleColapsed() {
  toggleColapsedInjected(columnParams.value.id);
  emit('update:visible', false);
}
function setSorting(direction: 'asc' | 'desc') {
  setSortingInjected(columnParams.value.name, direction);
  emit('update:visible', false);
}
function removeSorting() {
  removeSortingInjected(columnParams.value.name);
  emit('update:visible', false);
}
function hideColumn() {
  hideColumnInjected(columnParams.value.id);
  emit('update:visible', false);
}
function toggleGrouping() {
  toggleGroupingInjected(
    targetType.value === 'header'
      ? columnParams.value.id
      : manageCellParams.value.columnId,
  );
  emit('update:visible', false);
}
function ungroupAll() {
  ungroupAllInjected();
  emit('update:visible', false);
}
</script>
<style>
.tnnc-context-menu-content {
  display: flex;
  flex-direction: column;
}
.tnnc-contex-menu-btn {
  background: transparent;
  transition: all 0.1s;
  border: none;
  padding: 2px;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}
.tnnc-contex-menu-btn:hover {
  color: var(--tnnc-color-blue);
}
</style>
