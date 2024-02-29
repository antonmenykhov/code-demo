<template>
  <div class="handbooks-view">
    <h1>Справочники</h1>
    <TableComponent
      :rows="handbookItems"
      :columns="[{ name: 'name', caption: 'Название', editable: true }]"
      class="stretch-table"
      allow-add
      allow-delete
      allow-edit
      allow-filter
      allow-toolbar
      allow-sorting
      @save-row="saveHandbookItem"
      @delete-row="deleteHandbookItem"
    >
      <template #toolbar-left>
        <SelectBox
          label="Справочники"
          :options="handbookList"
          :value="currentHandbook"
          value-type="object"
          display-expr="name"
          value-expr="id"
          allow-search
          @update:value="setCurrentHandbok"
        />
        <HandbookManagmentPopup
          :handbook-list="handbookList"
          @create-and-insert="createAndInsertHandbook"
          @update-and-insert="(data) => updateAndReplaceHandbook(data.id, data.dto)"
          @remove-and-splice="removeAndSpliceHandbook"
          @close="updateCurrentHandbook"
        />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import HandbookManagmentPopup from '@/components/HandbookManagmentPopup.vue'
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type {
  Handbook,
  CreateHandbookDto,
  HandbookItem,
  CreateHandbookItemDto
} from '@/interfaces/hadnbook.interface'
import {
  SelectBox,
  TableComponent,
  type EditigngSaveEvent,
  type EditingDeleteEvent,
  confirm
} from '@tnnc/tnnc-ui-kit'
import { ref } from 'vue'

const {
  collection: handbookList,
  getAll: getHandbokList,
  getOne: getOneHandbook,
  createAndInsert: createAndInsertHandbook,
  updateAndReplace: updateAndReplaceHandbook,
  removeAndSplice: removeAndSpliceHandbook
} = useDefaultCrud<Handbook, CreateHandbookDto>('handbook')

const currentHandbook = ref<Handbook | null>(null)

async function setCurrentHandbok(handbook: Handbook) {
  return getOneHandbook(handbook.id).then((data) => {
    currentHandbook.value = data
    handbookItems.value = currentHandbook.value.items || []
  })
}

function updateCurrentHandbook() {
  if (currentHandbook.value) setCurrentHandbok(currentHandbook.value)
}

getHandbokList()

const {
  createAndInsert: createAndInsertHandbookItem,
  updateAndReplace: updateAndReplaceHandbookItem,
  removeAndSplice: removeAndSpliceHandbookItem,
  collection: handbookItems
} = useDefaultCrud<HandbookItem, CreateHandbookItemDto>('handbook-item')

async function saveHandbookItem(e: EditigngSaveEvent<HandbookItem>) {
  if (!currentHandbook.value) return
  if (e.isNew) {
    await createAndInsertHandbookItem({ handbookId: currentHandbook.value.id, name: e.row.name })
  } else {
    await updateAndReplaceHandbookItem(e.row.id, {
      handbookId: currentHandbook.value.id,
      name: e.row.name
    })
  }
  e.closeEditor()
}

async function deleteHandbookItem(e: EditingDeleteEvent<HandbookItem>) {
  confirm('Удалить запись из справочника?')
    .then(() => {
      removeAndSpliceHandbookItem(e.row.id)
    })
    .catch(() => {})
}
</script>
