<template>
  <TableComponent
    ref="table"
    css-class="stretch-table prodprog"
    key-expr="id"
    :rows="choosedHandbook"
    :columns="choosedColumns"
    :allow-add="canAdd"
    :allow-delete="canDelete"
    :allow-edit="canEdit"
    allow-toolbar
    show-total-counter
    allow-pagination
    allow-grouping
    allow-filter
    allow-sorting
    :number-formating-razryad="0"
    :key="selectedHandbook"
    @mounted="stopLoading"
    @save-row="saveRow"
    @delete-row="deleteRow"
  >
    <template #toolbar-left>
      <SelectBox
        label="Справочник"
        :options="handbooksForSelection.sort((a, b) => a.text.localeCompare(b.text, 'RU'))"
        :value="selectedHandbook"
        @update:value="setSelectedHandbook"
        display-expr="text"
        value-expr="key"
        allow-search
      />
    </template>
  </TableComponent>
</template>
<script lang="ts" setup>
import {
  SelectBox,
  TableComponent,
  type EditigngSaveEvent,
  type EditingDeleteEvent,
  confirm
} from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHandbookStore } from '@/store/handbooks.store'
import type { TprHandbook } from './composables/useHandbooks.composable'
import useHandbookColumns from './columns/useHandbookColumns'
import useHandbooks from './composables/useHandbooks.composable'
import { useLoadingState } from '@/store/loading.state'
import { useLockStore } from '@/store/lock.store'

const { handbooks } = storeToRefs(useHandbookStore())
const selectedHandbook = ref<keyof TprHandbook>('curatorDepartment')
const handbooksForSelection: {
  text: string
  key: keyof TprHandbook
  disableEdit?: boolean
  disableAdd?: boolean
  disableDelete?: boolean
}[] = [
  { text: 'Кураторы', key: 'curatorDepartment' },
  { text: 'Организации', key: 'organization' },
  { text: 'Виды работ', key: 'kindWork' },
  { text: 'Группы видов работ', key: 'groupKindWork' },
  { text: 'Направления работ', key: 'directWork' },
  { text: 'Статусы', key: 'statusCalendarPlan' },
  { text: 'Управления', key: 'department' },
  { text: 'Управления тех. зак.', key: 'departmentOrganization' },
  { text: 'Блоки', key: 'blockDepartment' },
  { text: 'Группы', key: 'groupDepartment' },
  { text: 'НДС', key: 'nds' },
  { text: 'Периметр', key: 'perimeterPeriod' },
  { text: 'Формат заключения договора', key: 'formatGeneralContract' },
  { text: 'Объем работ договора', key: 'scopeWorkSubcontract' },
  { text: 'Причины передачи на субподряд', key: 'reasonWorkSubcontract' },
  { text: 'Комментарии к статусам', key: 'commentStatusCalendarPlan' },
  { text: 'Производственные блоки', key: 'industrialBlock' },
  { text: 'Позиции без НДС', key: 'noNds' },
  { text: 'Настройки отчета экономика', key: 'reportEconomicSection' },
  { text: 'Экспорт', key: 'exportCustomer' },
  { text: 'Разделы ошибок', key: 'sectionError' },
  { text: 'Расшифровка ошибок', key: 'decodeError', disableAdd: true, disableDelete: true },
  { text: 'Номера договоров', key: 'numberContract' },
  { text: 'Календарные планы', key: 'calendarPlan' }
]
const choosedHandbook = computed(() => handbooks.value[selectedHandbook.value])

const { columns } = useHandbookColumns()
const choosedColumns = computed(() => columns.value[selectedHandbook.value])

const { manualLoading } = storeToRefs(useLoadingState())
function setSelectedHandbook(newSelectedHandbook: keyof TprHandbook) {
  if (selectedHandbook.value !== newSelectedHandbook) manualLoading.value = true
  setTimeout(() => {
    selectedHandbook.value = newSelectedHandbook
  }, 5)
}
function stopLoading() {
  sortByFirstColumn()
  manualLoading.value = false
}

const table = ref<InstanceType<typeof TableComponent>>()
function sortByFirstColumn() {
  if (table.value) {
    table.value.setSorting(
      table.value.tableColumnsTree.filter((col) => col.columnType !== 'manage')[0].name,
      'asc'
    )
  }
}

const { isAdmin, isEconomist } = storeToRefs(useLockStore())
const choosedHandbookForSelection = computed(() =>
  handbooksForSelection.find((handbook) => handbook.key === selectedHandbook.value)
)
const canAdd = computed(
  () => (isAdmin.value || isEconomist.value) && !choosedHandbookForSelection.value?.disableAdd
)
const canEdit = computed(
  () => (isAdmin.value || isEconomist.value) && !choosedHandbookForSelection.value?.disableEdit
)
const canDelete = computed(
  () => (isAdmin.value || isEconomist.value) && !choosedHandbookForSelection.value?.disableDelete
)

const { createSuppHandbookItem, updateSuppHandbookItem, deleteSuppHandbookItem } = useHandbooks()

async function saveRow<T>(e: EditigngSaveEvent<T>) {
  if (e.isNew) {
    await createSuppHandbookItem<T>(selectedHandbook.value, { ...e.row, id: undefined })
  } else {
    await updateSuppHandbookItem<T>(selectedHandbook.value, e.row)
  }
  e.closeEditor()
}

async function deleteRow<T extends { _rawRow: T }>(e: EditingDeleteEvent<T>) {
  confirm('Удалить элемент справочника?')
    .then(() => {
      return deleteSuppHandbookItem<T>(selectedHandbook.value, e.row._rawRow)
    })
    .catch(() => {})
}
</script>
