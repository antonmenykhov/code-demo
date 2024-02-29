<template>
  <TableComponent
    :rows="collection"
    :columns="columns"
    css-class="stretch-table"
    allow-pagination
    allow-toolbar
    allow-filter
    allow-sorting
    allow-grouping
    allow-fixing
    allow-export
    additional-features
    column-chooser
    ref="table"
  >
  </TableComponent>
</template>
<script lang="ts" setup>
import { baseUrl } from '@/config/baseUrl'
import type { AxiosInstance } from 'axios'
import { TableComponent, type Column } from '@tnnc/tnnc-ui-kit'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

const http = inject('http') as AxiosInstance
const route = useRoute()

async function getRow() {
  return (
    await http.get<{ [key: string]: string }[]>(
      `${baseUrl}/${(route.params.id as string[]).join('/')}`
    )
  ).data
}
const collection = ref<{ [key: string]: string }[]>(
  (await getRow()).map((row, index) => ({ ...row, id: `${index}` }))
)

const columns = ref<Column[]>([])

generateColumns()
function generateColumns() {
  Object.keys(collection.value[0] || {}).forEach((key) => {
    if (key !== 'id')
      columns.value.push({
        name: key,
        caption: key,
        columnType: 'string'
      })
  })
}
</script>
