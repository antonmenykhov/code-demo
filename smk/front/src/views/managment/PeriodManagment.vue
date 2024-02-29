<template>
  <div class="container">
    <h1>Периоды проведения опроса</h1>
    <TableComponent
      :columns="columns"
      :rows="periods"
      :allow-add="true"
      :allow-toolbar="true"
      :allow-delete="true"
      :allow-edit="true"
      :allow-pagination="true"
      allow-sorting
      allow-grouping
      allow-fixing
      css-class="stretch-table"
      @delete-row="removeRowHandler"
      @save-row="saveRowHandler"
    />
  </div>
</template>
<script lang="ts" setup>
import usePeriods from '@/composables/use-periods.composable'
import type { SurveyPeriod } from '@/interfaces/survey-period.interface'
import {
  confirm,
  TableComponent,
  type Column,
  type EditigngSaveEvent,
  type EditingDeleteEvent
} from 'tnnc-ui-kit'

const columns: Column[] = [
  {
    name: 'periodName',
    columnType: 'string',
    caption: 'Название периода',
    width: 600,
    editable: true
  },
  {
    name: 'start',
    columnType: 'date',
    caption: 'Начало',
    editable: true
  },
  {
    name: 'finish',
    columnType: 'date',
    caption: 'Окончание',
    editable: true
  }
]

const { periods, create, change, remove } = usePeriods()

async function saveRowHandler(e: EditigngSaveEvent<SurveyPeriod>) {
  if (e.isNew) {
    await create(e.row.periodName, e.row.start, e.row.finish)
  } else {
    await change(e.row.periodName, e.row.start, e.row.finish, e.row.id)
  }
  e.closeEditor()
}

async function removeRowHandler(e: EditingDeleteEvent<SurveyPeriod>) {
  confirm('Удалить период?')
    .then(() => {
      remove(e.row.id)
    })
    .catch(() => {})
}
</script>
