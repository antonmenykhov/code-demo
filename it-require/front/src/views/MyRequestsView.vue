<template>
  <div class="my-requests">
    <h1>Мои заявки</h1>
    <TableComponent
      :rows="collection"
      :columns="columns"
      class="stretch-table"
      allow-filter
      allow-toolbar
      allow-sorting
      :custom-manage-buttons="buttons"
    >
      <template #toolbar-right-before> </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import {
  confirm,
  TableComponent,
  type Column,
  type CustomManageButton,
  type TableRow
} from '@tnnc/tnnc-ui-kit'
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type { CreateRequestDto, Request } from '@/interfaces/request.interface'
import { useRouter } from 'vue-router'

const { collection, getAll, removeAndSplice } = useDefaultCrud<Request, CreateRequestDto>('request')
getAll()

const columns: Column[] = [
  { name: 'id', caption: '№ заявки', width: 80 },
  {
    name: 'form.name',
    caption: 'Заполненная форма',
    nestedValue: true
  },
  {
    name: 'stage.name',
    caption: 'Стадия',
    nestedValue: true
  }
]

const router = useRouter()
const buttons: CustomManageButton[] = [
  {
    title: 'Удалить заявку',
    icon: 'fa-solid fa-trash',
    fn(row: TableRow<Request>) {
      confirm('Удалить заявку?')
        .then(() => {
          removeAndSplice(row._rawRow.id)
        })
        .catch(() => {})
    },
    condition(row: TableRow<Request>, isEditing?) {
      if (row._rawRow.stage?.initialStage) return true
      if (row._rawRow.stage?.roleId === null) return true
      return false
    }
  },
  {
    title: 'Смотреть',
    icon: 'fa-solid fa-eye',
    fn(row: TableRow<Request>) {
      router.push({ path: `/request-card/${row._rawRow.id}` })
    }
  }
]
</script>
