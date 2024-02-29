<template>
  <ReportTable
    class="supp-report-kind-work"
    :resource-name="resourceName"
    :rows="rows"
    :columns="columnsComputed"
    id-expr="orders"
    :number-formating-ed="settings.multyplier"
    :number-formating-razryad="settings.lengtAfterDot"
    v-model:settings-for-save="settings"
    @update:settings-for-save="getRows"
    @settings-loaded="getRows"
  >
    <template #toolbar-left>
      <YearChooser v-model:year="settings.year" @update:year="getRows" />
      <MonthRange
        text="Нар.итог"
        v-model:range="settings.growingRange"
        @update:range="getRows"
        hide-from
      />
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
import ReportTable from '@/widgets/report-table/ReportTable.vue'
import type { Column } from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import YearChooser from '@/components/general/YearChooser.vue'
import useSuppReportsHttp from '@/composables/http/use-supp-reports-http.composable'
import type { SuppKindworkReport } from '@/interfaces/supp-entities/reports/kindwork.interface'
import { months } from '@/hooks/months'
import MonthRange from '@/components/general/MonthRange.vue'
import NumberFormatingDropDown from '@/components/general/NumberFormatingDropDown.vue'

const resourceName = 'suppMnemonic'
const rows = ref<SuppKindworkReport[]>([])

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

const groups = [
  { name: 'Объем работ всего', slug: 'gen', color: 'blue' },
  { name: 'в т.ч. Субподряд', slug: 'sub', color: 'green' },
  { name: 'в т.ч. объем работ соб. силами', slug: 'own', color: 'orange' }
]

const groupsForFirtst_Third = [
  {
    name: 'БП',
    slug: 'plan',
    percent: false
  },
  {
    name: 'ОЖИД',
    slug: 'prognoz',
    percent: false
  },
  {
    name: 'откл. тыс.руб.',
    slug: 'diff',
    percent: false,
    diffTemplate: true
  },
  {
    name: 'откл. %',
    slug: 'diff_percent',
    percent: true,
    diffTemplate: true
  }
]

const subGroups = computed(() => [
  {
    slug: 'nakopitel',
    childs: groupsForFirtst_Third,
    name: `${months[settings.value.growingRange[0] - 1]} - ${
      months[settings.value.growingRange[1] - 1]
    }`
  },
  {
    slug: 'nakopitelnext',
    childs: groupsForFirtst_Third,
    name: `Ожидаемое выполнение за следующий отчетный период: ${
      months[settings.value.growingRange[0] - 1]
    } - ${months[settings.value.growingRange[1] - 1]}`
  },
  {
    name: 'В целом за год',
    slug: '',
    childs: groupsForFirtst_Third
  },
  {
    name: 'Статус заключения тыс. руб',
    slug: '',
    childs: [
      {
        name: 'Заключен',
        slug: 'complete',
        percent: false
      },
      {
        name: 'Заключается',
        slug: 'process',
        percent: false
      },
      {
        name: 'Не знаключен',
        slug: 'no_complete',
        percent: false
      }
    ]
  },
  {
    name: 'Статус заключения %',
    slug: '',
    childs: [
      {
        name: 'Заключен',
        slug: 'complete_percent',
        percent: true
      },
      {
        name: 'Заключается',
        slug: 'process_percent',
        percent: true
      },
      {
        name: 'Не знаключен',
        slug: 'no_complete_percent',
        percent: true
      }
    ]
  }
])

const columnsComputed = computed<Column[]>(() => {
  const columns: Column[] = [
    {
      name: 'names',
      caption: 'Наименование вида деятельности',
      columnType: 'string',
      width: 300
    }
  ]

  groups.forEach((group) => {
    const first_level_column: Column = {
      name: group.slug,
      caption: group.name,
      cssClass: `index-color-${group.color}`,
      columnType: 'joined',
      child: []
    }
    subGroups.value.forEach((subGroup) => {
      const second_level_column: Column = {
        name: `${group.slug}_${subGroup.slug}`,
        caption: subGroup.name,
        width: 100,
        cssClass: `index-color-${group.color}`,
        columnType: 'joined',
        child: []
      }
      subGroup.childs.forEach((subGroupChild) => {
        const third_level_column: Column = {
          name: `${group.slug}_${subGroup.slug ? `${subGroup.slug}_` : ''}${subGroupChild.slug}`,
          caption: subGroupChild.name,
          //templateName: subGroupChild.diffTemplate ? 'DiffTemplate' : '',
          cssClass: `index-color-${group.color}`,
          columnType: subGroupChild.percent ? 'computedText' : 'number',
          computing: {
            value(rowData, column) {
              return `${rowData[column.name]?.toFixed(0) || '(Пусто)'}`
            }
          },
          child: [],
          width: 130
        }
        second_level_column.child?.push(third_level_column)
      })
      first_level_column.child?.push(second_level_column)
    })
    columns.push(first_level_column)
  })
  return columns
})

const { getReportKindWork } = useSuppReportsHttp()
async function getRows() {
  getReportKindWork(settings.value.year, settings.value.growingRange[1]).then(({ data }) => {
    rows.value = data
  })
}
</script>
<style lang="scss">
.report-kind-work {
  &.tnnc-table {
    th {
      &.index-color-blue {
        background: rgb(220, 230, 241);
      }
      &.index-color-orange {
        background: rgb(255, 223, 159);
      }
      &.index-color-green {
        background: rgb(235, 241, 222);
      }
    }
    .tnnc-table-cell:not(.tnnc-table-cell:first-child) {
      text-align: right;
    }

    .tnnc-table-row:nth-last-child(2) {
      td {
        font-weight: 700;
      }
    }
  }
}
</style>
