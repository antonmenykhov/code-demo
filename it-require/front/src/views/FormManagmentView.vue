<template>
  <div class="handbooks-view">
    <h1>Управление формами</h1>
    <TableComponent
      :rows="formList"
      :columns="[{ name: 'name', caption: 'Название', editable: true }]"
      class="stretch-table"
      allow-delete
      allow-edit
      allow-filter
      allow-toolbar
      allow-sorting
      @delete-row="deleteForm"
      @start-editing="startEditing"
    >
      <template #toolbar-right-before>
        <ButtonComponent text="Добавить" @click="startEditing" />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type { CreateFormDto, Form } from '@/interfaces/form.inteface'
import {
  ButtonComponent,
  TableComponent,
  type EditingStartEvent,
  type EditingDeleteEvent,
  confirm
} from '@tnnc/tnnc-ui-kit'
import { useRouter } from 'vue-router'

const {
  collection: formList,
  getAll: getAllForms,
  removeAndSplice: removeAndSpliceForm
} = useDefaultCrud<Form, CreateFormDto>('form')
getAllForms()

async function deleteForm(e: EditingDeleteEvent<Form>) {
  confirm('Удалить форму?')
    .then(() => {
      removeAndSpliceForm(e.row.id)
    })
    .catch(() => {})
}

const router = useRouter()
function startEditing(e?: EditingStartEvent<Form>) {
  e?.stop()
  const id = e ? e.row.id : 0
  router.push({ path: `/form/${id}` })
}
</script>
