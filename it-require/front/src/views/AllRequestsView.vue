<template>
  <div class="my-requests">
    <h1>Все заявки</h1>
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
import { TableComponent, type Column, type CustomManageButton, type TableRow } from '@tnnc/tnnc-ui-kit'
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type { CreateRequestDto, Request } from '@/interfaces/request.interface'
import { useRouter } from 'vue-router'
import type { UserRepresentation } from '@/interfaces/defs/userRepresentation'
import { computed } from 'vue'

const { collection, getAll } = useDefaultCrud<Request, CreateRequestDto>('request/all')
getAll()

const { collection: users, getAll: getAllUsers } = useDefaultCrud<UserRepresentation>('users')
getAllUsers()
const columns = computed<Column[]>(() => [
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
  },
  {
    name: 'userId',
    caption: 'Автор',
    columnType: 'enum',
    lookup: {
      handbook: users.value,
      displayExpr: 'lastName',
      valueExpr: 'id',
      idExpr: 'id'
    }
  }
])

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
</script>
