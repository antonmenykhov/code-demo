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
    :allow-edit="isAdmin"
    additional-features
    column-chooser
    ref="table"
    @save-row="saveRow"
  >
  </TableComponent>
</template>
<script lang="ts" setup>
import { baseUrl } from '@/config/baseUrl'
import { roleStore } from '@/store/role.store'
import type { AxiosInstance } from 'axios'
import { storeToRefs } from 'pinia'
import { TableComponent, type Column, type EditigngSaveEvent } from '@tnnc/tnnc-ui-kit'
import { computed, inject, ref } from 'vue'
import { handbooksStore } from '@/store/hanbooks.store'

const { isAdmin } = storeToRefs(roleStore())

const http = inject('http') as AxiosInstance

async function getRow() {
  return (await http.get<{ [key: string]: string }[]>(`${baseUrl}/show_pre_result_exit_form`)).data
}
const collection = ref<{ [key: string]: string }[]>(
  (await getRow()).map((row, index) => ({ ...row, id: `${index}` }))
)

async function saveRow(e: EditigngSaveEvent<{ id: string; [key: string]: string }>) {
  if (!e.isNew) {
    http
      .put(`${baseUrl}/update_fact_source`, {
        Город: e.row['07.Город'],
        'Цель командировки': e.row['06.Цель коммандировки'],
        'Даты командировки': e.row['09.Даты командировки'],
        f13_id: e.row['f13_id']
      })
      .then(() => {
        const existIndex = collection.value.findIndex((item) => item.id === e.row.id)
        if (existIndex !== -1) {
          collection.value.splice(existIndex, 1, e.row)
        }
        e.closeEditor()
      })
  }
}

const { handbooks } = storeToRefs(handbooksStore())

const columns = computed<Column[]>(() => [
  { name: '01.Блок', caption: 'Блок' },
  { name: '02.Подразделение ШР', caption: 'Подразделение ШР' },
  { name: '03.МВЗ', caption: 'МВЗ' },
  { name: '04.Наименование МВЗ', caption: 'Наименование МВЗ' },
  { name: '05.ФИО', caption: 'ФИО' },
  {
    name: '06.Цель коммандировки',
    caption: 'Цель коммандировки',
    editable: true,
    columnType: 'enum',
    lookup: {
      handbook: handbooks.value.trip_goals,
      displayExpr: 'goal_name',
      valueExpr: 'goal_name',
      idExpr: 'goal_name'
    }
  },
  { name: '07.Город', caption: 'Город', editable: true },
  { name: '08.Сторно', caption: 'Сторно' },
  { name: '09.Даты командировки', caption: 'Даты командировки', editable: true },
  { name: '10.Период расходов', caption: 'Период расходов' },
  { name: '11.Период расходов(Год)', caption: 'Период расходов(Год)' },
  { name: '12.Вид расходов', caption: 'Вид расходов' },
  { name: '13.Оборот Дт', caption: 'Оборот Дт', columnType: 'number' },
  { name: '14.Текст', caption: 'Текст' },
  { name: '15.№ Докум', caption: '№ Докум' },
  { name: '16.Док71', caption: 'Док71' },
  { name: '71-51_Т_Н', caption: '71-51_Т_Н' },
  { name: 'Выгрузка_Т_Н', caption: 'Выгрузка_Т_Н' },
  { name: 'Выч_Т_Н', caption: 'Выч_Т_Н' }
])
</script>
