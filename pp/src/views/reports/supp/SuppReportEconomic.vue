<template>
  <ReportTable
    class="report-economic"
    :columns="columns"
    :rows="rows"
    :resource-name="`suppEconomic${reportType}`"
    :number-formating-ed="settings.multyplier"
    :number-formating-razryad="settings.lengtAfterDot"
    id-expr="OrderRow"
    v-model:settings-for-save="settings"
    @update:settings-for-save="getRows"
    @settings-loaded="getRows"
  >
    <template #toolbar-left>
      <YearChooser v-model:year="settings.year" @update:year="getRows" />
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
import useSuppReportsHttp from '@/composables/http/use-supp-reports-http.composable'
import { months } from '@/hooks/months'
import type {
  SuppEconomicCapexReport,
  SuppEconomicReport
} from '@/interfaces/supp-entities/reports/economic.interface'
import ReportTable from '@/widgets/report-table/ReportTable.vue'
import type { Column } from 'tnnc-ui-kit'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import YearChooser from '@/components/general/YearChooser.vue'
import NumberFormatingDropDown from '@/components/general/NumberFormatingDropDown.vue'

const route = useRoute()
export type SuppEconomicReportType = 'common' | 'tp' | 'capex'
const reportType: SuppEconomicReportType =
  (route.meta?.reportType as SuppEconomicReportType | undefined) || 'common'

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
type ColumnGroup = { caption: string; prefix: string; capexable?: boolean }
const columnGroups: ColumnGroup[] = [
  {
    caption: 'Всего',
    prefix: 'total'
  },
  {
    caption: 'Региональная геология, ГРР, сейсморазведочные работы',
    prefix: 'reg_geo',
    capexable: true
  },
  {
    caption: 'ПТД, ПЗ (в т.ч. мониторинг месторождений)',
    prefix: 'ptd_pz',
    capexable: true
  },
  {
    caption: 'Лабораторные исследования',
    prefix: 'lab_isl',
    capexable: true
  },
  {
    caption: 'НИОКР в т.ч. ИТ',
    prefix: 'niokr',
    capexable: true
  },
  {
    caption: 'Концептуальное проектирование (в т.ч. интегрированные проекты)',
    prefix: 'concept',
    capexable: true
  },
  {
    caption: 'Обустройство месторождений',
    prefix: 'obust_mest'
  },
  {
    caption: 'Инженерные изыскания',
    prefix: 'ing_iz'
  },
  {
    caption: 'Инжиниринговые услуги для строительства',
    prefix: 'ing_serv_build'
  },
  {
    caption: 'Проектирование строительства скважин',
    prefix: 'proekt_str_skv'
  },
  {
    caption: 'Прочие производственные',
    prefix: 'other_prod'
  },
  {
    caption: 'Прочие поступления',
    prefix: 'other'
  }
]
const isCapex = computed(() => reportType === 'capex')

function getColumnsGroup(
  columnGroup: ColumnGroup,
  year: number,
  postfix: 'opex' | 'capex' | '' = ''
): Column {
  const captionPostfix = `${postfix ? '(' + postfix.toUpperCase() + ')' : ''}`
  return {
    name: `totalJoined${columnGroup.prefix}${postfix}`,
    cssClass: 'index-color-blue-green',
    columnType: 'joined',
    caption: `${columnGroup.caption} ${captionPostfix}`,
    collapsing: {
      collapsable: true,
      collapseTarget: 13
    },
    child: [
      {
        name: `prevFact${columnGroup.prefix}${postfix}`,
        cssClass: 'index-color-brown',
        columnType: 'number',
        caption: `Факт ${year - 1} ${captionPostfix}`
      },
      ...months.map<Column>((month, index) => ({
        name: `${columnGroup.prefix}${index + 1}${postfix}`,
        cssClass: 'index-color-brown',
        columnType: 'number',
        caption: `${month} ${year} ${captionPostfix}`
      })),
      {
        name: `total${columnGroup.prefix}${postfix}`,
        columnType: 'number',
        caption: `${year} ${captionPostfix}`,
        cssClass: 'index-color-brown'
      },
      {
        name: `bp${columnGroup.prefix}${postfix}`,
        columnType: 'number',
        caption: `${year} ${captionPostfix}`,
        cssClass: 'index-color-brown right-red-left-black-column'
      }
    ]
  }
}

const columns = computed<Column[]>(() => [
  {
    name: 'code',
    cssClass: 'index-color-brown',
    columnType: 'string',
    caption: 'Код статьи',
    width: 100
  },
  {
    name: 'name',
    cssClass: 'index-color-brown',
    columnType: 'string',
    caption: 'Наименование',
    width: 200
  },
  ...columnGroups.reduce<Column[]>((acc, group) => {
    if (isCapex.value && group.capexable) {
      acc.push(getColumnsGroup(group, settings.value.year, 'opex'))
      acc.push(getColumnsGroup(group, settings.value.year, 'capex'))
    } else {
      acc.push(getColumnsGroup(group, settings.value.year))
    }
    return acc
  }, []),
  {
    name: 'codeeconomica',
    cssClass: 'index-color-brown',
    columnType: 'string',
    caption: 'Код экономика',
    width: 100
  }
])

const rows = ref<((SuppEconomicReport | SuppEconomicCapexReport) & { _rowCssClass?: string })[]>([])
const { getReportEconomic } = useSuppReportsHttp()
async function getRows() {
  getReportEconomic(settings.value.year, reportType).then(({ data }) => {
    rows.value = data.map((row) => {
      addColorToList(row.color)
      return {
        ...row,
        _rowCssClass: `color${row.color} level${row.level}`
      }
    })
    createCssClass()
  })
}

const colorList = new Set<string>()
function addColorToList(color: string) {
  colorList.add(color)
}

function deleteReportStyle() {
  document.getElementById('reportDynamicStyles')?.remove()
}

function createCssClass() {
  deleteReportStyle()
  const style = document.createElement('style')
  style.id = 'reportDynamicStyles'
  style.innerHTML = Array.from(colorList)
    .map((color) => `.report-economic .color${color} td { background: #${color}; }`)
    .join(' ')
  document.getElementsByTagName('head')[0].appendChild(style)
}
onBeforeUnmount(() => {
  deleteReportStyle()
})
</script>
<style lang="scss">
.report-economic {
  th.index-color-brown {
    background: rgb(73, 69, 41);
    color: white;
    i {
      color: black;
    }
  }
  th.index-color-blue-green {
    background: rgb(139, 255, 233);
    color: black;
  }
  .right-red-left-black-column {
    border-left: 2px solid black;
    border-right: 2px solid red;
  }
  .index-color-light-brown {
    background: rgb(148, 138, 84);
    td {
      color: white;
    }
  }

  .level1 {
    .name {
      text-transform: uppercase;
      font-weight: 500;
      font-size: 14px;
    }
  }
  .level2 {
    .name {
      text-transform: uppercase;
      font-weight: 500;
      font-size: 13px;
    }
  }
  .level3 {
    .name {
      font-weight: 500;
      padding-left: 15px;
    }
  }
  .level4 {
    .name {
      font-weight: 500;
      padding-left: 25px;
    }
  }
  .level5 {
    .name {
      padding-left: 35px;
    }
  }
  .level6 {
    .name {
      padding-left: 45px;
    }
  }
  .level7 {
    .name {
      padding-left: 55px;
    }
  }
}
</style>
