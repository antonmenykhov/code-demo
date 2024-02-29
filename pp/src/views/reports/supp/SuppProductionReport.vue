<template>
  <ReportTable
    class="supp-report-production"
    :resource-name="resourceName"
    :rows="rowsWithMappedCssClass"
    :columns="columns"
    :number-formating-ed="0.000001"
    :number-formating-razryad="2"
    id-expr="orders"
    v-model:settings-for-save="settings"
    @update:settings-for-save="getRows"
  >
    <template #toolbar-left>
      <YearChooser v-model:year="settings.year" @update:year="getRows" />
      <MonthRange text="Нар.итог" v-model:range="settings.growingRange" @update:range="getRows" />
    </template>
  </ReportTable>
</template>
<script lang="ts" setup>
import ReportTable from '@/widgets/report-table/ReportTable.vue'
import type { SuppProductionReport } from '@/interfaces/supp-entities/reports/production.interface'
import { getFormateValue, type Column, getNumberFromFormattedValue } from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import { months } from '@/hooks/months'
import YearChooser from '@/components/general/YearChooser.vue'
import MonthRange from '@/components/general/MonthRange.vue'
import useSuppReportsHttp from '@/composables/http/use-supp-reports-http.composable'

const resourceName = 'suppProduction'
const rows = ref<SuppProductionReport[]>([])
const rowsWithMappedCssClass = computed<(SuppProductionReport & { _rowCssClass?: string })[]>(() =>
  rows.value.map((row) => ({
    ...row,
    _rowCssClass: `blocks${row.blocks} groups${row.groups} levels${row.levels}`
  }))
)
const settings = ref({
  year: new Date().getFullYear(),
  growingRange: [1, 12]
})

type ColumnType = Column & { name: keyof SuppProductionReport | 'growingTotal' }

const columns = computed<ColumnType[]>(() => [
  {
    name: 'names',
    caption: 'Наименование',
    columnType: 'string',
    width: 200
  },
  {
    name: 'total',
    caption: `${settings.value.year} год`,
    columnType: 'number'
  },
  ...months.map<ColumnType>((month, index) => ({
    name: `index${index + 1}` as keyof SuppProductionReport,
    caption: `${month} ${settings.value.year}`,
    columnType: 'number'
  })),
  {
    name: 'growingTotal',
    columnType: 'computed',
    caption: `${months[settings.value.growingRange[0] - 1]} - ${
      months[settings.value.growingRange[1] - 1]
    } ${settings.value.year}`,
    computing: {
      value: calcGrowingTotal
    }
  }
])

function calcGrowingTotal(rowData: SuppProductionReport): string {
  if (rowData.names === 'Доля субподряда ПИР (без ПСС)')
    return getFormateValue(
      (getNumberFromFormattedValue(calcGrowingTotal(rows.value[36])) * 100000000) /
        getNumberFromFormattedValue(calcGrowingTotal(rows.value[0])) -
        getNumberFromFormattedValue(calcGrowingTotal(rows.value[15])),
      0.000001,
      2
    )
  if (rowData.names === 'Доля субподряда НТР')
    return getFormateValue(
      (getNumberFromFormattedValue(calcGrowingTotal(rows.value[33])) * 100000000) /
        getNumberFromFormattedValue(calcGrowingTotal(rows.value[0])) -
        getNumberFromFormattedValue(calcGrowingTotal(rows.value[15])),
      0.000001,
      2
    )
  if (rowData.names === 'Доля субподряда в общем объеме работ')
    return getFormateValue(
      (getNumberFromFormattedValue(calcGrowingTotal(rows.value[32])) * 100000000) /
        getNumberFromFormattedValue(calcGrowingTotal(rows.value[0])) -
        getNumberFromFormattedValue(calcGrowingTotal(rows.value[15])),
      0.000001,
      2
    )
  let sum = 0
  for (let i = settings.value.growingRange[0]; i <= settings.value.growingRange[1]; i++) {
    sum += +rowData[`index${i}` as keyof SuppProductionReport]
  }
  return getFormateValue(sum, 0.000001, 2)
}

const { getReportProduction } = useSuppReportsHttp()
async function getRows() {
  getReportProduction(settings.value.year).then(({ data }) => {
    for (let i = data.length - 1; i > data.length - 4; i--) {
      let item = data[i]
      item.total = item.total * 1000000
      for (let i = 1; i < 13; i++) {
        ;(item[`index${i}` as keyof SuppProductionReport] as number) *= 1000000
      }
    }
    rows.value = data
  })
}
</script>
<style lang="scss">
.report-production {
  .blocks0.levels0 {
    .total,
    .growingTotal {
      background: rgb(220, 230, 241);
      font-weight: 600;
    }
  }
  .blocks0.levels1 {
    td {
      background: rgb(220, 230, 241);
      font-weight: 600;
    }
    .names {
      padding-left: 20px;
      font-weight: 400;
    }
  }
  .blocks1.levels0 {
    .total,
    .growingTotal {
      background: rgb(255, 233, 159);
      font-weight: 600;
    }
  }
  .blocks1.levels1 {
    td {
      background: rgb(255, 233, 159);
      font-weight: 600;
    }
    .names {
      padding-left: 20px;
      font-weight: 400;
    }
  }
  .blocks2.levels0 {
    .total,
    .growingTotal {
      background: rgb(235, 241, 222);
      font-weight: 600;
    }
  }
  .blocks2.levels1 {
    td {
      background: rgb(235, 241, 222);
      font-weight: 600;
    }
    .names {
      padding-left: 20px;
      font-weight: 400;
    }
  }
  .levels0 {
    .names {
      padding-left: 40px;
      font-style: italic;
    }
  }
  .levels0.groupsnull {
    .names {
      padding-left: 20px;
      font-style: normal;
    }
  }

  .groups-1.levels1 {
    .names {
      font-weight: 600;
      padding-left: 5px;
    }
  }

  .groups-1.levels0 {
    .names {
      font-style: normal;
      padding-left: 20px;
    }
  }
  .blocks3 {
    td {
      background: rgb(239, 236, 245);
      font-weight: 600;
    }
    .names {
      font-weight: normal;
    }
  }
}
</style>
