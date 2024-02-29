<template>
  <div class="handbook-managment-popup">
    <ButtonComponent text="Изменить список справочников" @click="toggleOpened" />
    <PopupComponent
      v-model:visible="opened"
      title="Список справочников"
      close-on-outside-click
      width="1050px"
      @update:visible="(val) => (!val ? emit('close') : '')"
    >
      <TableComponent
        :rows="handbookList"
        :columns="columns"
        allow-add
        allow-delete
        allow-edit
        allow-filter
        allow-sorting
        allow-toolbar
        style="height: 70vh"
        @save-row="saveRow"
        @delete-row="deleteRow"
      />
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import type { CreateHandbookDto, Handbook } from '@/interfaces/hadnbook.interface'
import {
  PopupComponent,
  TableComponent,
  type Column,
  type EditigngSaveEvent,
  type EditingDeleteEvent,
  ButtonComponent,
  confirm
} from '@tnnc/tnnc-ui-kit'
import { ref } from 'vue'

const opened = ref(false)
const props = defineProps<{
  handbookList: Handbook[]
}>()
const emit = defineEmits<{
  (e: 'createAndInsert', dto: CreateHandbookDto): void
  (e: 'updateAndInsert', data: { id: number; dto: CreateHandbookDto }): void
  (e: 'removeAndSplice', id: number): void
  (e: 'close'): void
}>()

const columns: Column[] = [
  {
    name: 'name',
    caption: 'Название',
    width: 200,
    editable: true
  },
  {
    name: 'description',
    caption: 'Описание',
    editable: true,
    width: 700
  }
]

function toggleOpened() {
  opened.value = !opened.value
}

function saveRow(e: EditigngSaveEvent<Handbook>) {
  if (e.isNew) {
    emit('createAndInsert', { name: e.row.name, description: e.row.description })
  } else {
    emit('updateAndInsert', {
      id: e.row.id,
      dto: { name: e.row.name, description: e.row.description }
    })
  }
  e.closeEditor()
}

function deleteRow(e: EditingDeleteEvent<Handbook>) {
  confirm('Удалить справочник?')
    .then(() => {
      emit('removeAndSplice', e.row.id)
    })
    .catch(() => {})
}

defineExpose({ toggleOpened })
</script>
