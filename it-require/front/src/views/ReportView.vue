<template>
  <div class="report-view">
    <h1>Отчет</h1>
    <TableComponent
      :rows="collection"
      :columns="columns"
      class="stretch-table"
      allow-filter
      allow-toolbar
      allow-sorting
      allow-export
      allow-grouping
      :key="columns.length"
      :custom-manage-buttons="buttons"
      additional-features
    >
      <template #toolbar-left>
        <ReportGenerator v-model:columns="columns" />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import { TableComponent, type Column, type CustomManageButton, type TableRow } from '@tnnc/tnnc-ui-kit'
import { useRouter } from 'vue-router'
import type { Request } from '@/interfaces/request.interface'
import useDefaultCrud from '@/composables/use-default-crud.composable'
import { onMounted, ref } from 'vue'
import ReportGenerator from '@/components/ReportGenerator.vue'

const router = useRouter()
const buttons: CustomManageButton[] = [
  {
    title: 'Смотреть',
    icon: 'fa-solid fa-eye',
    fn(row: TableRow<Request>) {
      router.push({ path: `/request-card/${row._rawRow.id}` })
    }
  }
]

const { collection, getAll } = useDefaultCrud('report')
getAll()

const columns = ref<Column[]>([])

onMounted(() => {
  const savedColumns = localStorage.getItem('generated_columns')

  if (savedColumns) columns.value = JSON.parse(savedColumns)
})
</script>
