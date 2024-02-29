<template>
  <div class="report-generator">
    <ButtonComponent text="Редактор столбцов отчета" @click="isPopupVisible = !isPopupVisible" />
    <PopupComponent
      v-model:visible="isPopupVisible"
      title="Редактор столбцов отчета"
      close-on-outside-click
      width="1200px"
      height="700px"
    >
      <div class="two-table" v-if="contentVisible">
        <TableComponent
          :rows="awailibleColumns"
          :columns="tableColumns"
          allow-selection
          key-expr="name"
          ref="awailibleTable"
          style="height: 610px"
          group-rows-default-state-opened
          allow-toolbar
        >
          <template #toolbar-right-before>
            <ButtonComponent text="Добавить отмеченные" @click="addSelected" />
          </template>
        </TableComponent>
        <TableComponent
          :rows="editableColumns"
          :columns="tableColumns"
          allow-selection
          key-expr="name"
          ref="editableTable"
          style="height: 610px"
          group-rows-default-state-opened
          allow-toolbar
          allow-reordering
          @reordering="reorder"
        >
          <template #toolbar-right-before>
            <ButtonComponent text="Убрать отмеченные" @click="removeSelected" />
          </template>
        </TableComponent>
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type { Question } from '@/interfaces/question.interface'
import {
  ButtonComponent,
  PopupComponent,
  TableComponent,
  type Column,
  type ReorderingEvent
} from '@tnnc/tnnc-ui-kit'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  columns: Column[]
}>()

const emit = defineEmits<{
  (e: 'update:columns', data: Column[]): void
}>()

const editableColumns = ref<Column[]>([])

const { getAll: getAllQuestions, collection: questionCollection } = useDefaultCrud<
  Question & { form_name: string }
>('report/questions')
getAllQuestions()

const columnsFromQuestions = computed<Column[]>(() =>
  questionCollection.value.map((question) => ({
    name: `answer_${question.id}`,
    caption: question.text,
    meta: question.form_name
  }))
)

const columnsFromStageKeys: Column[] = [
  {
    name: 'stage.name',
    nestedValue: true,
    caption: 'Стадия',
    meta: 'Заявка'
  },
  {
    name: 'userId',
    caption: 'Пользователь',
    meta: 'Заявка'
  }
]

const awailibleColumns = computed(() =>
  [...columnsFromStageKeys, ...columnsFromQuestions.value].filter(
    (column) => !editableColumns.value.some((existColumn) => existColumn.name === column.name)
  )
)

const isPopupVisible = ref(false)

watch(isPopupVisible, (newVal) => {
  if (newVal) editableColumns.value = [...props.columns]
  if (!newVal) {
    emit('update:columns', editableColumns.value)
    localStorage.setItem('generated_columns', JSON.stringify(editableColumns.value))
  }
  setTimeout(() => {
    contentVisible.value = newVal
    groupTable()
  }, 200)
})

const contentVisible = ref(false)

const tableColumns: Column[] = [
  {
    name: 'caption',
    caption: 'Вопрос',
    width: 450
  },
  {
    name: 'meta',
    caption: 'Форма',
    rendered: false
  }
]

const awailibleTable = ref<InstanceType<typeof TableComponent>>()
function groupTable() {
  if (!awailibleTable.value) return setTimeout(() => groupTable(), 200)
  awailibleTable.value.setSettings({
    customColumnWidths: [
      {
        columnId: 'manage_column',
        width: 100
      }
    ],
    sortedColumns: [
      {
        columnName: 'caption',
        direction: 'asc'
      }
    ],
    groupedColumnIds: ['1']
  })
}

function addSelected() {
  if (!awailibleTable.value) return

  editableColumns.value.push(
    ...awailibleColumns.value.filter((col) => awailibleTable.value?.selectedRowsIds.has(col.name))
  )
  awailibleTable.value.selectedRowsIds.clear()
}

const editableTable = ref<InstanceType<typeof TableComponent>>()
function removeSelected() {
  if (!editableTable.value) return
  editableColumns.value = editableColumns.value.filter(
    (col) => !editableTable.value?.selectedRowsIds.has(col.name)
  )
  editableTable.value.selectedRowsIds.clear()
}

function reorder(e: ReorderingEvent) {
  editableColumns.value.splice(e.newIndex, 0, ...editableColumns.value.splice(e.oldIndex, 1))
}
</script>
<style lang="scss">
.two-table {
  display: flex;
  gap: 10px;
  & > * {
    flex: 1;
  }
}
</style>
