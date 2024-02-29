<template>
  <div class="container report-view">
    <TableComponent
      ref="table"
      :rows="rows"
      :columns="computedColumns"
      css-class="stretch-table"
      allow-pagination
      allow-toolbar
      allow-filter
      column-chooser
      allow-export
      allow-sorting
      allow-grouping
      allow-fixing
      key-expr="id"
      additional-features
      allow-column-numeration
      :number-formating-razryad="numberFormatingRazryad"
      :number-formating-ed="numberFormatingEd"
      :header-totals="totals"
      :groupRowsDefaultStateOpened="isCurator || isManager"
      show-group-counter
      show-total-counter
      @updated="
        () => {
          manualLoading = false
        }
      "
    >
      <template #toolbar-left>
        <SelectBox
          label="Версии для сравнения"
          :options="handbooks.versions"
          display-expr="name"
          value-expr="id"
          v-model:value="versionsIdsForCompare"
          css-class="fixed-width"
        />
        <SelectBox
          label="Показать отклонения"
          :options="deviationHandbook"
          display-expr="name"
          value-expr="id"
          v-model:value="deviationVersionsIds"
          css-class="fixed-width"
        />
        <ButtonComponent text="Сформировать отчет" @click="getRows" />
      </template>
      <template #toolbar-right-before>
        <SelectBox
          label="Нарастающий итог"
          :options="monthsHandbook"
          display-expr="name"
          value-expr="id"
          button-mode
          v-model:value="selectedMonths"
        />
        <NumberFormatingDropDown
          v-model:multyplier="numberFormatingEd"
          v-model:lenght-after-dot="numberFormatingRazryad"
        />
        <UserSettings resource="reportView" :table="table" />
      </template>
      <template #toolbar-right>
        <Toggle v-model:value="isColumnsPlain" label="Одноуровневая шапка" />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import NumberFormatingDropDown from '@/components/NumberFormatingDropDown.vue'
import { baseUrl } from '@/config/baseUrl'
import type { ReportRow } from '@/interfaces/report-row.interface'
import { handbooksStore } from '@/store/hanbooks.store'
import type { AxiosInstance } from 'axios'
import { storeToRefs } from 'pinia'
import { ButtonComponent, SelectBox, TableComponent, Toggle, type Column } from '@tnnc/tnnc-ui-kit'
import { type Ref, ref, inject, onMounted, computed } from 'vue'
import useMainReportColumns from './useMainReportColumns.composable'
import useTotals from './useTotals.composable'
import type { Version } from '@/interfaces/version.interface'
import { loadingState } from '@/store/loading.state'
import { versionStore } from '@/store/version.store'
import { roleStore } from '@/store/role.store'
import UserSettings from '@/components/UserSettings.vue'

const { handbooks } = storeToRefs(handbooksStore())
const { isManager, isCurator } = storeToRefs(roleStore())
const { version } = storeToRefs(versionStore())
const versionsIdsForCompare = ref<(number | string)[]>([])

export type DeviationItem = {
  name: string
  id: number
  firstVersion: Version
  secondVersion: Version
}
const deviationHandbook = computed(() => {
  const versions = selectedVersions.value
  const handbook: DeviationItem[] = []
  versions.forEach((firstVersion) => {
    versions.forEach((secondVersion) => {
      if (firstVersion.id !== secondVersion.id)
        handbook.push({
          name: `${firstVersion.name}/${secondVersion.name}`,
          id: handbook.length,
          firstVersion,
          secondVersion
        })
    })
  })
  return handbook
})
const deviationVersionsIds = ref<number[]>([])
const deviationVersionsComputed = computed(() =>
  deviationHandbook.value.filter((item) => deviationVersionsIds.value.includes(item.id))
)
const deviationVersions = ref<DeviationItem[]>([])

if (version.value) versionsIdsForCompare.value.push(version.value.id)
const versionsForCompare = ref<Version[]>([])
const http = inject('silentHttp') as AxiosInstance
const rows: Ref<ReportRow[]> = ref([])
const { computedColumns, monthsHandbook, selectedMonths, isColumnsPlain } = useMainReportColumns(
  versionsForCompare,
  deviationVersions
)

const { manualLoading } = storeToRefs(loadingState())
const selectedVersions = computed(() => [
  ...handbooks.value.versions
    .filter((version) => version.id === versionsIdsForCompare.value[0])
    .map((version) => ({ ...version, id: 'mv' })),
  ...handbooks.value.versions
    .filter((version) => versionsIdsForCompare.value.slice(1).includes(version.id))
    .map((version) => ({ ...version, id: `v${version.id}` }))
])
async function getRows() {
  manualLoading.value = true
  return http
    .post<ReportRow[]>(`${baseUrl}/show_exit_form_versions`, {
      main_version: versionsIdsForCompare.value[0],
      versions: versionsIdsForCompare.value.slice(1)
    })
    .then(({ data }) => {
      rows.value = data.map((row, index) => {
        row.id = index
        return row
      })
      versionsForCompare.value = selectedVersions.value
      deviationVersions.value = deviationVersionsComputed.value
    })
    .catch(() => {
      rows.value = []
    })
}

getRows()

const { totals } = useTotals()

const table = ref<InstanceType<typeof TableComponent>>()
onMounted(() => {
  if (table.value) {
    const column = table.value.tableColumnsTree.find(
      (col: Column) => col.name === 'department_name'
    )
    if (column) {
      table.value.toggleGrouping(column.id)
    }
    table.value.setSorting('number', 'asc')
    table.value
  }
})

const numberFormatingRazryad = ref(0)
const numberFormatingEd: Ref<1 | 0.001> = ref(1)
</script>
<style lang="scss">
.report-view {
  .tnnc-table-header-cell.joined {
    text-align: left;
  }
}
td.text-right.computed {
  text-align: right;
}
.fixed-width {
  width: 200px;
}
</style>
