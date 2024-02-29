<template>
  <TableComponent
    :rows="currentHandbook"
    :columns="currentColumns"
    css-class="stretch-table handbook-table"
    :allow-add="canEdit"
    :allow-delete="canEdit"
    :allow-edit="canEdit"
    allow-pagination
    allow-toolbar
    allow-filter
    allow-sorting
    allow-grouping
    allow-fixing
    column-chooser
    :number-formating-razryad="0"
    :custom-manage-buttons="customManageButtons"
    :meta="{ rows: currentHandbook }"
    @save-row="saveRowHandler"
    @delete-row="deleteRowHandler"
  >
    <template #toolbar-left>
      <slot name="toolbar-left"></slot>
    </template>
    <template #toolbar-right-before
      ><slot :getAllHandbooks="getAllHandbooks" name="toolbar-right-before"></slot
    ></template>
  </TableComponent>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import useHandbooks, {
  type HandbookList,
  type HandbookItem
} from '@/views/handbooks/useHandbooks.composable'
import useHandbooksColumns from '@/views/handbooks/useHandbooksColumn.composable'
import {
  TableComponent,
  type EditigngSaveEvent,
  type EditingDeleteEvent,
  confirm
} from '@tnnc/tnnc-ui-kit'

import { handbooksStore } from '@/store/hanbooks.store'
import type { CustomManageButton } from '@tnnc/tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'

const props = defineProps<{
  name: string
  multiplyName: keyof HandbookList
  canEdit: boolean
  customManageButtons?: CustomManageButton[]
  rowPrepareFunction?: (event: EditigngSaveEvent<HandbookItem>) => HandbookItem
}>()

const { addItem, updateItem, deleteItem, getAllHandbooks } = useHandbooks()
const handbookStore = handbooksStore()

const currentHandbook = computed(() => handbookStore.handbooks[props.multiplyName])

const { handbookColumns } = useHandbooksColumns()
const currentColumns = computed(() => handbookColumns.value[`${props.multiplyName}_columns`].value)

async function saveRowHandler(e: EditigngSaveEvent<HandbookItem>) {
  try {
    const rowData = props.rowPrepareFunction ? props.rowPrepareFunction(e) : e.row
    if (e.isNew) {
      await addItem(props.name, props.multiplyName, rowData)
    } else {
      await updateItem(props.name, props.multiplyName, rowData)
    }
    e.closeEditor()
  } catch (error) {
    console.log(error)
  }
}

async function deleteRowHandler(e: EditingDeleteEvent<HandbookItem>) {
  confirm('Удалить элемент?')
    .then(async () => {
      await deleteItem(props.name, props.multiplyName, e.row.id)
    })
    .catch(() => {})
}
</script>
<style lang="scss">
.text-center {
  text-align: center;
}
.handbook-table {
  td {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
