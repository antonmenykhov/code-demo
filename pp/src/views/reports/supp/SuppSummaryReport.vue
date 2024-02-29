<template>
  <ReportTable
    id-expr="names"
    :columns="columns"
    :rows="rows"
    resource-name="suppSummary"
    :allow-edit="canEdit"
    :number-formating-ed="settings.multyplier"
    :number-formating-razryad="settings.lengtAfterDot"
    class="report-summary"
    v-model:settingsForSave="settings"
    @update:settings-for-save="getRows"
    @settings-loaded="getRows"
    @save-row="saveRow"
  >
    <template #toolbar-left>
      <YearChooser v-model:year="settings.year" @update:year="getRows" />
      <MonthRange text="Нар.итог" v-model:range="settings.growingRange" @update:range="getRows" />
    </template>
    <template #toolbar-right>
      <NumberFormatingDropDown
        v-model:lenght-after-dot="settings.lengtAfterDot"
        v-model:multyplier="settings.multyplier"
      />
    </template>
  </ReportTable>
</template>
<script lang="ts" setup>
import { months } from '@/hooks/months'
import { useLockStore } from '@/store/lock.store'
import ReportTable from '@/widgets/report-table/ReportTable.vue'
import { storeToRefs } from 'pinia'
import type { Column, EditigngSaveEvent } from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import YearChooser from '@/components/general/YearChooser.vue'
import MonthRange from '@/components/general/MonthRange.vue'
import NumberFormatingDropDown from '@/components/general/NumberFormatingDropDown.vue'
import useSuppReportsHttp from '@/composables/http/use-supp-reports-http.composable'
import type { SuppSummaryReport } from '@/interfaces/supp-entities/reports/summary.interface'
import type { AxiosResponse } from 'axios'

const settings = ref<{
  year: number
  growingRange: [number, number]
  multyplier: 1 | 0.001
  lengtAfterDot: number
}>({
  year: new Date().getFullYear(),
  growingRange: [1, 12],
  multyplier: 1,
  lengtAfterDot: 0
})

const rows = ref<(SuppSummaryReport & { _rowCssClass?: string })[]>([])
const { getReportSummary, getDepartmentAmount, createDepartmentAmount, updateDepartmentAmount } =
  useSuppReportsHttp()
async function getRows() {
  getReportSummary(settings.value.year, settings.value.growingRange).then(({ data }) => {
    rows.value = data.map((row) => ({
      ...row,
      _rowCssClass: `levels${row.levels} ${row.ID < 0 || row.ID > 100000 ? 'not-editable' : ''}`
    }))
  })
}
async function saveRow(e: EditigngSaveEvent<SuppSummaryReport>) {
  const changedKeys = Object.keys(e.diff).filter((key) => key in rows.value[0])
  if (changedKeys.length > 0) {
    const deparmentAmount = (await getDepartmentAmount()).data
    const existItems = deparmentAmount.filter(
      (item) => item.departmentId === e.row.ID && item.year === settings.value.year
    )
    const promisesList: Promise<AxiosResponse>[] = []
    changedKeys.forEach((key) => {
      const genwork =
        key.split('_')[0] === 'gen' ? true : key.split('_')[0] === 'sub' ? false : null
      const directionAmountId =
        key.split('_')[1] === 'norm' ? 1 : key.split('_')[1] === 'discount' ? 2 : null
      if (directionAmountId !== null) {
        const existItem = existItems.find(
          (item) => item.directionAmountId === directionAmountId && item.genwork === genwork
        )
        if (existItem) {
          promisesList.push(
            updateDepartmentAmount({
              ...existItem,
              price: e.diff[key as keyof SuppSummaryReport] as number
            })
          )
        } else {
          promisesList.push(
            createDepartmentAmount({
              directionAmountId,
              genwork,
              price: e.diff[key as keyof SuppSummaryReport] as number,
              year: settings.value.year,
              departmentId: e.row.ID
            })
          )
        }
      }
    })
    Promise.all(promisesList).then(() => {
      e.closeEditor()
      getRows()
    })
  }
}

const { canEditSupp } = storeToRefs(useLockStore())
const lockStore = useLockStore()
const canEdit = computed(
  () => canEditSupp.value && lockStore.keycloak.hasResourceRole('reports_write', 'supp')
)

const columns = computed<Column[]>(() => [
  {
    name: 'names',
    cssClass: 'border-right-grey',
    columnType: 'string',
    caption: 'Подразделение',
    width: 150
  },
  ...totalColumns.value,
  ...subColumns.value,
  ...ssColumns.value,
  ...statusColumns.value
])

const accumnName = computed(
  () =>
    `${months[settings.value.growingRange[0] - 1]} - ${
      months[settings.value.growingRange[1] - 1]
    } ${settings.value.year}`
)
const nextName = computed(
  () => `${months[settings.value.growingRange[1] === 12 ? 11 : settings.value.growingRange[1]]}`
)

const percentComputing = {
  value(rowData: any, column: Column) {
    return `${rowData[column.name] || 0}`
  }
}

const totalColumns = computed<Column[]>(() => [
  {
    name: 'totalWorkVolume',
    columnType: 'joined',
    caption: 'Объем работ всего',
    child: [
      {
        name: 'totalStartClosed',
        columnType: 'joined',
        caption: accumnName.value,
        child: [
          {
            name: 'gen_accum_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'gen_accum_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ОЖИД'
          },
          {
            name: 'gen_accum_diff',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Разница ФАКТ/БП'
          }
        ]
      },
      {
        name: 'totalCurrentMonth',
        columnType: 'joined',
        caption: nextName.value,
        child: [
          {
            name: 'gen_next_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'gen_next_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ОЖИД'
          },
          {
            name: 'gen_next_diff',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Разница ФАКТ/БП'
          }
        ]
      },
      {
        name: 'totalFullYear',
        columnType: 'joined',
        caption: `${settings.value.year}`,
        child: [
          {
            name: 'gen_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'gen_norm',
            cssClass: 'index-color-green',
            columnType: 'number',
            caption: 'Нормализация БП между подразделениями',
            editable: true
          },
          {
            name: 'gen_plan_norm',
            cssClass: 'index-color-green',
            columnType: 'number',
            caption: 'БП Норм.'
          },
          {
            name: 'gen_old_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ПРЕДЫДУЩИЙ ПРОГНОЗ'
          },
          {
            name: 'gen_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ТЕКУЩИЙ ПРОГНОЗ'
          },
          {
            name: 'gen_economic',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: "Формуляр 'ЭКОНОМИКА'"
          },
          {
            name: 'gen_diff_economic',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: "Формуляр 'ЭКОНОМИКА' / БП"
          },
          {
            name: 'gen_diff',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Разница ТЕКУЩИЙ ПРОГНОЗ / БП'
          },
          {
            name: 'gen_diff_norm',
            cssClass: 'index-color-green border-red',
            columnType: 'number',
            caption: 'Разница ТЕКУЩИЙ ПРОГНОЗ / БП Норм. Кор.'
          },
          {
            name: 'gen_discount',
            cssClass: 'index-color-bright-green',
            columnType: 'number',
            caption: 'Снижение стоимости за счет закупок по с/п',
            editable: true
          },
          {
            name: 'gen_diff_discount',
            cssClass: 'index-color-bright-green border-red',
            columnType: 'number',
            caption: 'Для КПЭ Разница ТЕКУЩИЙ ПРОГНОЗ Снижение стоимости за счет закупок по с/п / '
          },
          {
            name: 'gen_diff_discount_percent',
            cssClass: 'index-color-bright-green border-red percent',
            columnType: 'computed',
            caption: 'Для КПЭ % ТЕКУЩИЙ ПРОГНОЗ / БП',
            computing: percentComputing
          }
        ]
      }
    ]
  }
])

const subColumns = computed<Column[]>(() => [
  {
    name: 'subsWorkVolume',
    columnType: 'joined',
    caption: 'в т.ч. субподряд',
    child: [
      {
        name: 'subsStartClosed',
        columnType: 'joined',
        caption: accumnName.value,
        child: [
          {
            name: 'sub_accum_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'sub_accum_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ОЖИД'
          },
          {
            name: 'sub_accum_diff',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Разница ФАКТ/БП'
          }
        ]
      },
      {
        name: 'subsCurrentMonth',
        columnType: 'joined',
        caption: nextName.value,
        child: [
          {
            name: 'sub_next_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'sub_next_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ОЖИД'
          },
          {
            name: 'sub_next_diff',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Разница ФАКТ/БП'
          }
        ]
      },
      {
        name: 'subsFullYear',
        columnType: 'joined',
        caption: `${settings.value.year}`,
        child: [
          {
            name: 'sub_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'sub_norm',
            cssClass: 'index-color-green',
            columnType: 'number',
            caption: 'Нормализация БП между подразделениями',
            editable: true
          },
          {
            name: 'sub_plan_norm',
            cssClass: 'index-color-green',
            columnType: 'number',
            caption: 'БП Норм.'
          },
          {
            name: 'sub_old_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ПРЕДЫДУЩИЙ ПРОГНОЗ'
          },
          {
            name: 'sub_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ТЕКУЩИЙ ПРОГНОЗ'
          },
          {
            name: 'sub_economic',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: "Формуляр 'ЭКОНОМИКА'"
          },
          {
            name: 'sub_diff_economic',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: "Формуляр 'ЭКОНОМИКА' / БП"
          },
          {
            name: 'sub_diff',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Разница ТЕКУЩИЙ ПРОГНОЗ / БП'
          },
          {
            name: 'sub_diff_norm',
            cssClass: 'index-color-green border-red',
            columnType: 'number',
            caption: 'Разница ТЕКУЩИЙ ПРОГНОЗ / БП Норм.'
          }
        ]
      }
    ]
  }
])

const ssColumns = computed<Column[]>(() => [
  {
    name: 'ssWorkVolume',
    columnType: 'joined',
    caption: 'в т.ч. соб.силами',
    child: [
      {
        name: 'ssStartClosed',
        columnType: 'joined',
        caption: accumnName.value,
        child: [
          {
            name: 'own_accum_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'own_accum_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ОЖИД'
          },

          {
            name: 'own_accum_diff',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Разница ФАКТ/БП'
          }
        ]
      },
      {
        name: 'ssCurrentMonth',
        columnType: 'joined',
        caption: nextName.value,
        child: [
          {
            name: 'own_next_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'own_next_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ОЖИД'
          },
          {
            name: 'own_next_diff',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Разница ФАКТ/БП'
          }
        ]
      },
      {
        name: 'ssFullYear',
        columnType: 'joined',
        caption: `${settings.value.year}`,
        child: [
          {
            name: 'own_plan',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'БП'
          },
          {
            name: 'own_norm',
            cssClass: 'index-color-green',
            columnType: 'number',
            caption: 'Нормализация БП между подразделениями',

            editable: true
          },
          {
            name: 'own_plan_norm',
            cssClass: 'index-color-green',
            columnType: 'number',
            caption: 'БП Норм.'
          },
          {
            name: 'own_old_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ПРЕДЫДУЩИЙ ПРОГНОЗ'
          },
          {
            name: 'own_prognos',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'ТЕКУЩИЙ ПРОГНОЗ'
          },
          {
            name: 'own_economic',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: "Формуляр 'ЭКОНОМИКА'"
          },
          {
            name: 'own_diff_economic',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: "Формуляр 'ЭКОНОМИКА' / БП"
          },
          {
            name: 'own_diff',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Разница ТЕКУЩИЙ ПРОГНОЗ / БП'
          },
          {
            name: 'own_diff_norm',
            cssClass: 'index-color-green border-red',
            columnType: 'number',
            caption: 'Разница ТЕКУЩИЙ ПРОГНОЗ / БП Норм. Кор.'
          },
          {
            name: 'own_norm_diff_percent',
            cssClass: 'index-color-blue border-right-grey percent',
            columnType: 'computed',
            caption: '% ТЕКУЩИЙ ПРОГНОЗ / БП Норм.',
            computing: percentComputing
          }
        ]
      }
    ]
  }
])

const statusColumns = computed<Column[]>(() => [
  {
    name: 'statusGen',
    columnType: 'joined',
    caption: 'Статус заключения генподряда ',
    child: [
      {
        name: 'statusGenMoney',
        columnType: 'joined',
        caption: 'тыс. руб',
        child: [
          {
            name: 'gen_complete',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Заключен'
          },
          {
            name: 'gen_process',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Заключается'
          },
          {
            name: 'gen_no_complete',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Не заключен'
          }
        ]
      },
      {
        name: 'statusGenPercent',
        columnType: 'joined',
        caption: '%',
        child: [
          {
            name: 'gen_complete_percent',
            cssClass: 'index-color-blue percent',
            columnType: 'computed',
            caption: 'Заключен',
            computing: percentComputing
          },
          {
            name: 'gen_process_percent',
            cssClass: 'index-color-blue percent',
            columnType: 'computed',
            caption: 'Заключается',
            computing: percentComputing
          },
          {
            name: 'gen_no_complete_percent',
            cssClass: 'index-color-blue border-right-grey percent',
            columnType: 'computed',
            caption: 'Не заключен',
            computing: percentComputing
          }
        ]
      }
    ]
  },
  {
    name: 'statusSub',
    columnType: 'joined',
    caption: 'Статус заключения субподряда ',
    child: [
      {
        name: 'statusSubMoney',
        columnType: 'joined',
        caption: 'тыс. руб',
        child: [
          {
            name: 'sub_complete',
            cssClass: 'index-color-blue ',
            columnType: 'number',
            caption: 'Заключен'
          },
          {
            name: 'sub_process',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Заключается'
          },
          {
            name: 'sub_no_complete',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Не заключен'
          }
        ]
      },
      {
        name: 'statusSubPercent',
        columnType: 'joined',
        caption: '%',
        child: [
          {
            name: 'sub_complete_percent',
            cssClass: 'index-color-blue percent',
            columnType: 'computed',
            caption: 'Заключен',
            computing: percentComputing
          },
          {
            name: 'sub_process_percent',
            cssClass: 'index-color-blue percent',
            columnType: 'computed',
            caption: 'Заключается',
            computing: percentComputing
          },
          {
            name: 'sub_no_complete_percent',
            cssClass: 'index-color-blue border-right-grey percent',
            columnType: 'computed',
            caption: 'Не заключен',
            computing: percentComputing
          }
        ]
      }
    ]
  },
  {
    name: 'statusSS',
    columnType: 'joined',
    caption: 'Статус заключения собственные силы ',
    child: [
      {
        name: 'statusSSMoney',
        columnType: 'joined',
        caption: 'тыс. руб',
        child: [
          {
            name: 'own_complete',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Заключен'
          },
          {
            name: 'own_process',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Заключается'
          },
          {
            name: 'own_no_complete',
            cssClass: 'index-color-blue border-right-grey',
            columnType: 'number',
            caption: 'Не заключен'
          }
        ]
      },
      {
        name: 'statusSSPercent',
        columnType: 'joined',
        caption: '%',
        child: [
          {
            name: 'own_complete_percent',
            cssClass: 'index-color-blue percent',
            columnType: 'computed',
            caption: 'Заключен',
            computing: percentComputing
          },
          {
            name: 'own_process_percent',
            cssClass: 'index-color-blue percent',
            columnType: 'computed',
            caption: 'Заключается',
            computing: percentComputing
          },
          {
            name: 'own_no_complete_percent',
            cssClass: 'index-color-blue border-right-grey percent',
            columnType: 'computed',
            caption: 'Не заключен',
            computing: percentComputing
          }
        ]
      }
    ]
  }
])
</script>
<style lang="scss">
.report-summary {
  .levels2 {
    background: rgb(218, 238, 243);
    td {
      background: rgb(218, 238, 243);
      font-weight: 600;
    }
  }
  .levels1 {
    td {
      font-weight: 500;
    }
  }
  .levels4 {
    background: rgb(217, 217, 217);
    td {
      background: rgb(217, 217, 217);
      font-weight: 600;
    }
  }
  th.index-color-blue {
    background: rgb(220, 230, 241);
  }

  th.index-color-orange {
    background: rgb(255, 192, 0);
  }

  th.index-color-green {
    background: rgb(196, 215, 155);
  }

  th.index-color-bright-green {
    background: rgb(146, 208, 80);
  }
  .border-right-grey {
    border-right: 1px solid grey;
  }
  .border-red {
    border-right: 2px solid red;
    border-left: 2px solid red;
  }
  .not-editable {
    .tnnc-manage-button {
      display: none;
    }
  }
  .tnnc-table-cell.percent {
    text-align: center;
  }
}
</style>
