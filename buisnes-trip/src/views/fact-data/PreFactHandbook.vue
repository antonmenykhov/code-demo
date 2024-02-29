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
    hide-zero-numbers
    ref="table"
    :totals="totals"
    :allow-edit="isAdmin"
    @save-row="saveRow"
  >
  </TableComponent>
</template>
<script lang="ts" setup>
import { baseUrl } from '@/config/baseUrl'
import type { AxiosInstance } from 'axios'
import {
  TableComponent,
  type Column,
  type TableTotal,
  getFormateValue,
  getNumberFromFormattedValue,
  type EditigngSaveEvent
} from '@tnnc/tnnc-ui-kit'
import { inject, ref } from 'vue'
import { handbooksStore } from '@/store/hanbooks.store'
import { storeToRefs } from 'pinia'
import { roleStore } from '@/store/role.store'

const { isAdmin } = storeToRefs(roleStore())

const totals: TableTotal[] = [
  {
    name: 'Итого',
    function(column, rows, ed, razryd) {
      return getFormateValue(
        rows.reduce((acc, row) => {
          if (row[column.name] !== '(Пусто)') acc += getNumberFromFormattedValue(row[column.name])
          return acc
        }, 0),
        ed,
        razryd
      )
    }
  }
]
const http = inject('http') as AxiosInstance

async function getRow() {
  return (await http.get<{ [key: string]: string }[]>(`${baseUrl}/show_fact_result_exit_form`)).data
}
const collection = ref<{ [key: string]: string }[]>(
  (await getRow()).map((row, index) => ({ ...row, id: `${index}` }))
)

async function saveRow(e: EditigngSaveEvent<{ id: string; [key: string]: string }>) {
  if (!e.isNew) {
    http
      .put(`${baseUrl}/update_fact_source`, {
        'Город': e.row['07.Город'],
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

const columns = ref<Column[]>([
  {
    name: '01.Блок',
    caption: 'Блок',
    width: 70
  },
  {
    name: '02.Подразделение ШР',
    caption: 'Подразделение ШР',
    width: 250
  },
  {
    name: '03.МВЗ',
    caption: 'МВЗ'
  },
  {
    name: '04.Наименование МВЗ',
    caption: 'Наименованием МВЗ',
    width: 150
  },
  {
    name: '05.ФИО',
    caption: 'ФИО',
    width: 250
  },
  {
    name: '06.Цель коммандировки',
    caption: 'Цель командировки',
    width: 150,
    editable: true,
    columnType: 'enum',
    lookup: {
      handbook: handbooks.value.trip_goals,
      displayExpr: 'goal_name',
      valueExpr: 'goal_name',
      idExpr: 'goal_name'
    }
  },
  {
    name: '07.Город',
    caption: 'Город',
    width: 150,
    editable: true
  },
  {
    name: '09.Даты командировки',
    caption: 'Даты командировки',
    width: 125,
    editable: true
  },
  {
    name: '08.Период расходов',
    caption: 'Период расходов',
    columnType: 'computedText',
    computing: {
      value(rowData) {
        return `${rowData['08.Период расходов']} ${rowData['09.Период расходов(Год)']}`
      }
    },
    width: 125
  },
  {
    name: '10.Расходы',
    caption: 'Расходы',
    columnType: 'number',
    width: 130
  },
  {
    name: '11.Проезд',
    caption: 'Проезд',
    columnType: 'number',
    width: 130
  },
  {
    name: '12.Проживание',
    caption: 'Проживание',
    columnType: 'number',
    width: 130
  },
  {
    name: '13.Суточные',
    caption: 'Суточные',
    columnType: 'number',
    width: 130
  },
  {
    name: '14.Услуги бронирования',
    caption: 'Услуги бронирования',
    columnType: 'number',
    width: 130
  },
  {
    name: 'other',
    caption: 'Прочее'
  }
])
</script>
