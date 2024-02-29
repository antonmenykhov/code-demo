<template>
  <div class="home">
    <TableComponent
      :rows="filteredRow"
      :columns="columns"
      :allow-pagination="true"
      :allow-filter="true"
      :allow-toolbar="true"
      :allow-add="false"
      :additional-features="allowEditing"
      :column-chooser="true"
      :allow-export="allowEditing"
      :allow-edit="allowEditing"
      :allow-delete="allowEditing"
      allow-sorting
      allow-fixing
      allow-grouping
      :css-class="`stretch-table ${cssClass}`"
      key-expr="ID"
      :selection-mode="'single'"
      :allow-selection="allowSelection"
      @start-editing="editingStart"
      @delete-row="deleteRow"
      @selection-changed="emitSelectionChange"
    >
      <template #toolbar-left>
        <slot :getRows="getRows"></slot>
        <TextInput
          v-model:value="searchPhrase"
          placeholder="Поиск по текстовым полям..."
          :show-clear-button="true"
          css-class="search-input"
          label="Поиск по текстовым полям"
        />
      </template>
      <template #toolbar-right-before>
        <slot name="right"></slot>
      </template>
    </TableComponent>
  </div>
</template>

<script lang="ts" setup>
import type { TprSmall } from '@/interfaces/supp-entities/tpr-small.interface'
import {
  TableComponent,
  TextInput,
  type Column,
  type EditingDeleteEvent,
  type EditingStartEvent
} from 'tnnc-ui-kit'
import { computed, ref, type Ref } from 'vue'
import { useDebounce } from '@vueuse/core'
import type { Department } from '@/interfaces/supp-entities/department.interface'
import useTprHttp from '@/composables/http/use-tpr-http.composable'

const props = defineProps<{
  year: number
  onlyGens?: boolean
  allowEditing?: boolean
  cssClass?: string
  allowSelection?: boolean
  availableDepartments?: Department[]
}>()
const year = computed(() => props.year)
const rows: Ref<TprSmall[]> = ref([])
const { getTprLight } = useTprHttp()
async function getRows() {
  setTimeout(() => {
    getTprLight(year.value).then(({ data }) => {
      rows.value = data
    })
  }, 0)
}
await getRows()
const searchPhrase = ref('')
const columns: Column[] = [
  { name: 'ID', caption: '№', columnType: 'string', width: 80 },
  { name: 'Name', caption: 'Наименование работ', columnType: 'string', width: 300 },
  { name: 'NumberContract', caption: 'Номер договора', columnType: 'string' },
  { name: 'Customer', caption: 'Контрагент', columnType: 'string' },
  { name: 'Start', caption: 'Дата начала', columnType: 'date' },
  { name: 'Finish', caption: 'Дата окончания', columnType: 'date' },
  { name: 'StatusCalendarPlan', caption: 'Статус', columnType: 'string' },
  { name: 'Genwork', caption: 'Ген/Суб', columnType: 'string' },
  { name: 'Department', caption: 'Управление', columnType: 'string' },
  { name: 'KindWork', caption: 'Вид работ', columnType: 'string' },
  { name: 'DirectWork', caption: 'Направление работ', columnType: 'string' },
  { name: 'Risk', caption: 'Риск', columnType: 'string' },
  { name: 'Opex', caption: 'CAPEX/Opex', columnType: 'string' }
]
const emit = defineEmits<{
  (e: 'editingStart', data: EditingStartEvent<TprSmall>): void
  (e: 'deleteRow', data: EditingDeleteEvent<TprSmall>): void
  (e: 'selectionChanged', data: number): void
}>()
function editingStart(e: EditingStartEvent<TprSmall>) {
  e.stop()
  emit('editingStart', e)
}
function deleteRow(e: EditingDeleteEvent<TprSmall>) {
  emit('deleteRow', e)
}

const debouncedSearchPhrase = useDebounce(searchPhrase, 200)
const filteredByGen = computed(() => {
  if (props.onlyGens) return rows.value.filter((row) => row.Genwork === 'генподряд')
  return rows.value
})
const filteredByDepartment = computed(() => {
  if (props.availableDepartments)
    return filteredByGen.value.filter((row) =>
      props.availableDepartments?.find((dep) => dep.name === row.Department)
    )
  return filteredByGen.value
})
const filteredRow = computed(() => {
  if (debouncedSearchPhrase.value.length) {
    const searchPhrase = debouncedSearchPhrase.value.toLowerCase()
    return filteredByDepartment.value.filter((row) => {
      for (let i = 0; i < columns.length; i++) {
        if (
          columns[i].columnType === 'string' &&
          `${row[columns[i].name as keyof TprSmall]}`.toLowerCase().includes(searchPhrase)
        )
          return true
      }
      return false
    })
  }
  return filteredByDepartment.value
})

function emitSelectionChange(data: Set<string>) {
  emit('selectionChanged', +Array.from(data)[0])
}
</script>
<style lang="scss">
.home {
  height: 100%;
  min-height: 100%;
}
.search-input {
  width: 400px;
}
</style>
