<template>
  <div class="handbooks-view">
    <h1>Стадии заявок</h1>
    <TableComponent
      :rows="requestStages"
      :columns="columns"
      class="stretch-table"
      allow-add
      allow-delete
      allow-edit
      allow-filter
      allow-toolbar
      allow-sorting
      @save-row="saveRequestStage"
      @delete-row="deleteRequestStage"
    >
      <template #toolbar-left> </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type { RoleRepresentation } from '@/interfaces/defs/roleRepresentation'
import type { CreateRequestStageDto, RequestStage } from '@/interfaces/request.interface'
import {
  confirm,
  TableComponent,
  type Column,
  type EditigngSaveEvent,
  type EditingDeleteEvent,
  type TableRow
} from '@tnnc/tnnc-ui-kit'
import { computed } from 'vue'

const {
  collection: requestStages,
  createAndInsert: createRequestStage,
  updateAndReplace: updateRequestStage,
  removeAndSplice: removeRequestStage,
  getAll: getAllRequestStages
} = useDefaultCrud<RequestStage, CreateRequestStageDto>('request-stage')

function returnNullableNumberValue(value: string | number | null) {
  if (value === 'null' || !value || !+value) return null
  return +value
}
function returnNullableStingValue(value: string | null) {
  if (value === 'null' || !value) return null
  return value
}

async function saveRequestStage(e: EditigngSaveEvent<RequestStage>) {
  const { id, initialStage, name, nextStageId, previousStageId, roleId } = e.row
  if (e.isNew) {
    await createRequestStage({
      initialStage,
      name,
      nextStageId: returnNullableNumberValue(nextStageId),
      previousStageId: returnNullableNumberValue(previousStageId),
      roleId: returnNullableStingValue(roleId)
    })
  } else {
    await updateRequestStage(id, {
      initialStage,
      name,
      nextStageId: returnNullableNumberValue(nextStageId),
      previousStageId: returnNullableNumberValue(previousStageId),
      roleId: returnNullableStingValue(roleId)
    })
  }
  e.closeEditor()
}

async function deleteRequestStage(e: EditingDeleteEvent<TableRow<RequestStage>>) {
  confirm('Удалить указанную стадию?')
    .then(() => {
      removeRequestStage(e.row._rawRow.id)
    })
    .catch(() => {})
}

getAllRequestStages()

const { collection: roles, getAll: getAllRoles } = useDefaultCrud<RoleRepresentation>('roles')
getAllRoles()

const columns = computed<Column[]>(() => [
  {
    name: 'name',
    caption: 'Название стадии',
    editable: true
  },
  {
    name: 'initialStage',
    caption: 'Иницирующая стадия',
    editable: true,
    columnType: 'boolean',
    trueValue: 'Да',
    falseValue: 'Нет'
  },
  {
    name: 'nextStageId',
    caption: 'Следующая стадия',
    allowNullForSelection: true,
    columnType: 'enum',
    lookup: {
      handbook: requestStages.value,
      displayExpr: 'name',
      valueExpr: 'id',
      idExpr: 'id'
    },
    editable: true
  },
  {
    name: 'previousStageId',
    caption: 'Стадия возврата',
    allowNullForSelection: true,
    columnType: 'enum',
    lookup: {
      handbook: requestStages.value,
      displayExpr: 'name',
      valueExpr: 'id',
      idExpr: 'id'
    },
    editable: true
  },
  {
    name: 'roleId',
    caption: 'Роль пользователя, который может взаимодействовать с заявкой на этой стадии',
    allowNullForSelection: true,
    columnType: 'enum',
    lookup: {
      handbook: roles.value,
      displayExpr: 'description',
      valueExpr: 'name',
      idExpr: 'name'
    },
    editable: true
  }
])
</script>
