<template>
  <div class="container">
    <TableComponent
      :rows="reportWithMappedCss"
      :columns="columns"
      css-class="stretch-table"
      allow-pagination
      allow-toolbar
      allow-filter
      allow-sorting
      allow-grouping
      allow-fixing
      column-chooser
      ref="table"
      :group-rows-default-state-opened="true"
    />
  </div>
</template>
<script lang="ts" setup>
import useUserStatus from '@/composables/use-user-status.composable'
import { TableComponent, type Column } from '@tnnc/tnnc-ui-kit'
import { computed, onMounted, ref } from 'vue'

const { getUserStatusReport, userStatusReport } = useUserStatus()
getUserStatusReport()

const reportWithMappedCss = computed(() =>
  userStatusReport.value.map((row) => ({
    ...row,
    _rowCssClass: row.data_changed ? 'green-row' : ''
  }))
)

const columns: Column[] = [
  {
    name: 'department_name',
    columnType: 'string',
    caption: 'Управление'
  },
  {
    name: 'fio',
    columnType: 'string',
    caption: 'ФИО'
  },
  {
    name: 'status',
    columnType: 'string',
    caption: 'Статус'
  },
  {
    name: 'date',
    columnType: 'date',
    caption: 'Дата статуса'
  },
  {
    name: 'data_changed',
    columnType: 'boolean',
    caption: 'Данные изменены',
    trueValue: 'Да',
    falseValue: 'Нет',
    width: 100
  }
]
const table = ref<InstanceType<typeof TableComponent>>()
onMounted(() => {
  if (table.value) {
    const column = table.value.tableColumnsTree.find(
      (col: Column) => col.name === 'department_name'
    )
    if (column) {
      table.value.toggleGrouping(column.id)
    }
    table.value.setSorting('fio', 'asc')
    table.value
  }
})
</script>
<style lang="scss">
.green-row {
  td {
    background: #aeff75;
  }
}
</style>
