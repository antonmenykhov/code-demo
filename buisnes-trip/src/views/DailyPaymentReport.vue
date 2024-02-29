<template>
  <div class="container report-view">
    <TableComponent
      ref="table"
      :rows="rows"
      :columns="columns"
      css-class="stretch-table"
      allow-pagination
      allow-toolbar
      allow-filter
      column-chooser
      allow-export
      allow-sorting
      allow-fixing
      key-expr="bt_id"
      additional-features
      allow-column-numeration
      :number-formating-razryad="numberFormatingRazryad"
      :number-formating-ed="numberFormatingEd"
      :totals="totals"
      groupRowsDefaultStateOpened
      show-group-counter
      show-total-counter
    >
      <template #toolbar-right-before>
        <NumberFormatingDropDown
          v-model:multyplier="numberFormatingEd"
          v-model:lenght-after-dot="numberFormatingRazryad"
        />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import { baseUrl } from '@/config/baseUrl'
import type { AxiosInstance } from 'axios'
import { type Column, TableComponent, type TableRow, type TableTotal } from '@tnnc/tnnc-ui-kit'
import { computed, inject, ref } from 'vue'
import { months } from '@/hooks/months'
import NumberFormatingDropDown from '@/components/NumberFormatingDropDown.vue'
import { parseFormatedValue, formatNumberValue } from '@/hooks/format.hook'

const http = inject('http') as AxiosInstance
const numberFormatingEd = ref<1 | 0.001>(1)
const numberFormatingRazryad = ref(0)
const rows = ref([])
async function getRow() {
  return http.get(`${baseUrl}/show_exit_form_daily_payment`).then(({ data }) => (rows.value = data))
}
await getRow()
const totals: TableTotal[] = [
  {
    name: 'Итого',
    function(column, rows, ed, razryd) {
      if (column.name === 'mvz_code') return 'Общий итог'
      const sum = rows.reduce((acc, row) => {
        const value =
          column.columnType === 'computed'
            ? parseFormatedValue(row[column.name] as string)
            : (row['_rawRow'] as TableRow)[column.name]
        if (value && !isNaN(+value)) acc += +value
        return acc
      }, 0)
      return formatNumberValue(sum, ed, razryd)
    }
  }
]
const columns = computed(() => {
  const currentYear = +String(new Date().getFullYear()).slice(1)
  const columnsArray: Column[] = [
    {
      name: 'mvz_name',
      caption: 'Наименование МВЗ',
      columnType: 'string'
    },
    {
      name: 'mvz_code',
      caption: 'МВЗ',
      columnType: 'number',
      formating: {
        disable: true
      }
    },
    ...months.map<Column>((month) => ({
      name: `${month.slice(0, 3)} ${currentYear}`,
      columnType: 'number',
      caption: `${month.slice(0, 3)} ${currentYear}`
    })),
    {
      name: 'total',
      caption: 'Итого за год',
      columnType: 'number'
    }
  ]

  return columnsArray
})
</script>
