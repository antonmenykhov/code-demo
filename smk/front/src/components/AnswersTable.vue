<template>
  <TableComponent
    allow-toolbar
    allow-filter
    column-chooser
    css-class="stretch-table"
    :rows="rows"
    :columns="columns"
    :allow-pagination="rows.length > 100"
    allow-export
    additional-features
    :number-formating-razryad="2"
    :export-name="exportName"
    :totals="totals"
    allow-sorting
    allow-grouping
    allow-fixing
  >
    <template #toolbar-left>
      <SelectBox
        v-model:value="currentPeriod"
        :options="periods"
        displayExpr="periodName"
        value-expr="id"
        allow-search
        @update:value="getRows"
        label="Период"
      />
    </template>
  </TableComponent>
</template>
<script lang="ts" setup>
import useEmployees from '@/composables/use-employees.composable'
import usePeriods from '@/composables/use-periods.composable'
import type { AnswerReportRow } from '@/interfaces/answer-report-row.interface'
import type { AxiosInstance } from 'axios'
import {
  TableComponent,
  type Column,
  SelectBox,
  TableColumn,
  type TableRow,
  getFormateValue
} from 'tnnc-ui-kit'
import { computed, inject, ref, watch, type Ref } from 'vue'
import DocuemntsCell from './DocuemntsCell.vue'
import type { TableTotal } from 'tnnc-ui-kit/dist/interfaces/table-props.interface'
import type { AnswerActionRowDto } from '@/interfaces/answer-action-row.interface'

const props = defineProps<{
  url: string
  isAdmin: boolean
  withActions?: boolean
}>()
const http = inject('http') as AxiosInstance
const { employees } = useEmployees()
const { periods } = usePeriods()
const currentPeriod: Ref<null | number> = ref(null)
const columns = computed(() => {
  const columns: Column[] = [
    {
      name: 'group',
      caption: 'Структурное подразделение',
      columnType: 'string'
    },
    {
      name: 'question',
      caption: 'Процесс (Направление деятельности)',
      columnType: 'string'
    },
    {
      name: 'numericVariant',
      caption: 'Оценка',
      columnType: 'number',
      width: 70,
      computing: {
        grouping: (rows: AnswerReportRow[]) =>
          +(
            rows.reduce((acc, row) => +acc + +row.numericVariant, 0) /
            (rows.filter((row) => +row.numericVariant !== 0).length || 1)
          ).toFixed(2)
      }
    },
    {
      name: 'comment',
      caption: 'Несоответствие/Замечание/Предложение',
      columnType: 'string'
    }
  ]
  if (props.isAdmin) {
    columns.push({
      name: 'userId',
      caption: 'ФИО респондента',
      columnType: 'enum',
      lookup: {
        handbook: employees.value,
        displayExpr: 'fullFio',
        valueExpr: 'employeeId',
        idExpr: 'employeeId'
      }
    })
  }
  if (props.withActions) {
    columns.push(
      ...([
        {
          name: 'reason',
          caption: 'Причина несоответствия/замечания',
          columnType: 'string'
        },
        {
          name: 'action',
          caption: 'Корректирующее действие/мероприятие',
          columnType: 'string'
        },
        {
          name: 'responsible',
          caption: 'Ответственный исполнитель',
          columnType: 'computed',
          lookup: {
            handbook: employees.value,
            displayExpr: 'fullFio',
            valueExpr: 'employeeId',
            idExpr: 'employeeId'
          },
          computing: {
            value: (rowData: AnswerActionRowDto) => {
              if (!rowData.responsible) return '(Пусто)'
              const valuesList = rowData.responsible.split(';')
              const displayList = valuesList.map((value) => {
                const item = employees.value.find((emp) => emp.employeeId === value)
                if (item) return item.fullFio
                return value
              })
              return displayList.join('; ')
            }
          }
        },
        {
          name: 'dates',
          columnType: 'joined',
          caption: 'Срок исполнения',
          child: [
            {
              name: 'dateFinish',
              caption: 'План',
              columnType: 'date'
            },
            {
              name: 'factDateFinish',
              caption: 'Факт',
              columnType: 'date'
            }
          ]
        },

        {
          name: 'state',
          caption: 'Статус',
          columnType: 'string'
        },
        {
          name: 'completeComment',
          caption: 'Отчет о выполнении',
          columnType: 'string'
        },
        {
          name: 'documents',
          columnType: 'manage',
          caption: 'Подтверждающие документы',
          width: 120,
          templating: {
            cell: DocuemntsCell
          }
        }
      ] as Column[])
    )
  }
  return columns
})
const rows: Ref<AnswerReportRow[]> = ref([])
const currentPeriodName = computed(() =>
  currentPeriod.value
    ? periods.value.find((period) => period.id === currentPeriod.value)?.periodName
    : ''
)
const exportName = computed(() =>
  props.withActions
    ? `Отчет о КД за ${currentPeriodName.value}`
    : `Результаты опроса за ${currentPeriodName.value}`
)
watch(periods, (newVal) => {
  if (!currentPeriod.value && newVal.length > 0) {
    currentPeriod.value = newVal[newVal.length - 1].id
    getRows()
  }
})
async function getRows() {
  if (currentPeriod.value)
    http.get(`${props.url}/${currentPeriod.value}`).then(({ data }) => {
      rows.value = data
    })
}

const totals: TableTotal[] = [
  {
    name: '',
    function: (column: TableColumn, rows: TableRow[]) =>
      column.name === 'numericVariant'
        ? `Ср. ${(
            rows.reduce((acc, row) => {
              if (
                row.numericVariant &&
                row.numericVariant !== '(Пусто)' &&
                typeof row.numericVariant === 'string'
              ) {
                acc += +row.numericVariant
              }
              return acc
            }, 0) /
            // @ts-ignore
            (rows.filter((row) => row.numericVariant !== '(Пусто)' && +row.numericVariant !== 0)
              .length || 1)
          ).toFixed(2)}`
        : ''
  }
]
</script>
