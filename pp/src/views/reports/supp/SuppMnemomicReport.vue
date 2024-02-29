<template>
  <ReportTable
    :resource-name="resourceName"
    :rows="rows"
    :columns="columns"
    id-expr="number_etalon"
    v-model:settings-for-save="settings"
    @update:settings-for-save="getRows"
    @settings-loaded="getRows"
  >
    <template #toolbar-left>
      <YearChooser v-model:year="settings.year" @update:year="getRows" />
    </template>
  </ReportTable>
</template>
<script lang="ts" setup>
import ReportTable from '@/widgets/report-table/ReportTable.vue'
import type { SuppMnemonicReport } from '@/interfaces/supp-entities/reports/mnemonic.interface'
import type { Column } from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import YearChooser from '@/components/general/YearChooser.vue'
import useSuppReportsHttp from '@/composables/http/use-supp-reports-http.composable'

const resourceName = 'suppMnemonic'
const rows = ref<SuppMnemonicReport[]>([])

const settings = ref({
  year: new Date().getFullYear(),
  growingRange: [1, 12]
})

type ColumnType = Column & { name: keyof SuppMnemonicReport }

const columns = computed<ColumnType[]>(() => [
  {
    name: 'number_etalon',
    columnType: 'string',
    caption: 'Номер/эталон для сравнения'
  },
  {
    name: 'okved',
    columnType: 'string',
    caption: 'Оквэды'
  },
  {
    name: 'counts',
    columnType: 'string',
    caption: 'Число повторов в этом году'
  },
  {
    name: 'gen_part_number_contract',
    columnType: 'string',
    caption: 'Значимая часть номера договора'
  }
])

const { getReportMnemonic } = useSuppReportsHttp()
async function getRows() {
  getReportMnemonic(settings.value.year).then(({ data }) => {
    rows.value = data
  })
}
</script>
