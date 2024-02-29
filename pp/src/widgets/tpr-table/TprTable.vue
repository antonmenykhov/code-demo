<template>
  <TableComponent
    ref="table"
    :rows="filteredByBlockRows"
    :columns="columnsSliced"
    css-class="stretch-table prodprog"
    key-expr="ID"
    hide-zero-numbers
    :totals="totals"
    allow-sorting
    allow-grouping
    allow-fixing
    allow-pagination
    allow-filter
    allow-toolbar
    additional-features
    column-chooser
    allow-export
    allow-edit
    allow-column-numeration
    show-total-counter
    show-group-counter
    :number-formating-ed="multyplier"
    :number-formating-razryad="numberAfterDot"
    :meta="meta"
    :custom-manage-buttons="buttons"
    :key="settingsResource"
    @updated="tableUpdated"
    @start-editing="startEditing"
    @settings-changed="saveSettingsFromTable"
  >
    <template #toolbar-left>
      <Toggle
        v-title="'В режиме полного ТПРа программа будет работать медленнее'"
        css-class="tpr-switcher"
        :value="isFullTprShowed"
        label="Полный ТПР"
        @update:value="switchColumnMode"
      />
      <slot
        :getRows="getRowsAuto"
        :addChangeRow="addChangeRowHandler"
        :chooseRow="emitEditingStart"
        :deleteRow="deleteRow"
        :availableDepartments="availableDepartments"
      ></slot>
      <SelectBox
        label="Блок"
        :value="choosedBlocks"
        :options="handbooks.blockDepartment"
        display-expr="name"
        value-expr="id"
        show-clear-button
        css-class="width200px"
        @update:value="setChoosedBlocks"
      />
      <SelectBox
        label="Фильтр по ошибкам"
        :value="selectedErrorFilterOption"
        :options="errorFilterOptions"
        display-expr="caption"
        value-expr="id"
        css-class="width200px"
        @update:value="setSelectedError"
      />
    </template>
    <template #toolbar-right-before>
      <slot
        name="right"
        :getRows="getRowsAuto"
        :addChangeRow="addChangeRowHandler"
        :chooseRow="emitEditingStart"
        :deleteRow="deleteRow"
        :availableDepartments="availableDepartments"
      ></slot>
      <SelectBox
        v-if="isFullTprShowed"
        label="Месяц"
        :options="monthHandbookExtended"
        v-model:value="choosedMonths"
        display-expr="name"
        value-expr="id"
        button-mode
        :options-width="200"
        @update:value="setRenderedColumns"
      />
      <SelectBox
        v-if="isFullTprShowed"
        label="Силы"
        :options="forceTypes"
        v-model:value="choosedForceTypes"
        display-expr="caption"
        value-expr="name"
        button-mode
        :options-width="200"
        @update:value="setRenderedColumns"
      />
      <SelectBox
        v-if="isFullTprShowed"
        label="Показатели"
        :options="indexTypes"
        v-model:value="choosedIndexTypes"
        display-expr="caption"
        value-expr="name"
        button-mode
        :options-width="200"
        @update:value="setRenderedColumns"
      />
    </template>
    <template #toolbar-right>
      <MonthRange
        v-if="isFullTprShowed"
        text="Нар.итог"
        v-model:range="growingRange"
        @update:range="getRows(year, availableDepartments, growingRange, !isFullTprShowed)"
      />
      <NumberFormatingDropDown
        v-if="isFullTprShowed"
        v-model:lenght-after-dot="numberAfterDot"
        v-model:multyplier="multyplier"
      />
      <SettingsManaging
        ref="settingsManaging"
        :key="settingsResource"
        :resource="settingsResource"
        :table-ref="table"
        @settings-loaded="restoreOtherSettings"
      />
      <slot name="right-hidden" :months="handbooks.months"></slot>
    </template>
  </TableComponent>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import tprConfig from './columns'
import { TableComponent, SelectBox, Toggle } from 'tnnc-ui-kit'
import useTprCrud from './composables/useTprCrud.composable'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import NumberFormatingDropDown from '@/components/general/NumberFormatingDropDown.vue'
import useTprRoles from './composables/useTprRoles.composable'
import useTprExternalFilters from './composables/useTprExternalFilters.composable'
import MonthRange from '@/components/general/MonthRange.vue'
import useTprConnections from './composables/useTprConnections.composable'
import { useLoadingState } from '@/store/loading.state'
import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import useTprErrors from './composables/useTprErrors.composable'
import SettingsManaging from '@/components/general/SettingsManaging.vue'
import useTprSettings from './composables/useTprSettings.composable'
import useTprEditing from './composables/useTprEditing.composable'

const props = defineProps<{
  year: number
  editable: boolean
}>()
const emit = defineEmits<{
  (
    e: 'editingStart',
    data: {
      currentRow: TprStandart
      rowsWithSameMainNumber: TprStandart[]
      rowsWithSameContractId: TprStandart[]
    }
  ): void
}>()

const year = computed(() => props.year)
const numberAfterDot = ref(0)
const multyplier = ref<1 | 0.001>(1)
const growingRange = ref<number[]>([1, 12])
const { handbooks } = storeToRefs(useHandbookStore())
const { errors, getAllErrors } = useTprErrors(year)

const meta = computed(() => ({ connections: connections.value }))
const isFullTprShowed = ref(false)
const {
  columns,
  choosedForceTypes,
  choosedIndexTypes,
  forceTypes,
  indexTypes,
  monthHandbookExtended,
  choosedMonths,
  columnsSliced,
  totals,
  buttons
} = tprConfig(handbooks, isFullTprShowed, errors)

const { rows, getRows, addChangeRow, deleteRow, getItemsByIds } = useTprCrud(columns.value, year)
const { getConnections, connections, connectionMappedRows } = useTprConnections(rows)
const currentRowSet = computed(() =>
  isFullTprShowed.value ? connectionMappedRows.value : rows.value
)
async function getRowsAuto() {
  setTimeout(async () => {
    getConnections(year.value)
    await getRows(
      year.value,
      availableDepartments.value,
      growingRange.value,
      !isFullTprShowed.value
    )
  }, 1)
}

const table = ref<InstanceType<typeof TableComponent>>()
const {
  setRenderedColumns,
  choosedBlocks,
  filteredByBlockRows,
  selectedErrorFilterOption,
  errorFilterOptions,
  setChoosedBlocks,
  setSelectedError,
  tableUpdated
} = useTprExternalFilters(
  table,
  monthHandbookExtended,
  choosedMonths,
  choosedForceTypes,
  choosedIndexTypes,
  currentRowSet,
  handbooks,
  errors
)
const settingsManaging = ref<InstanceType<typeof SettingsManaging>>()
const { saveSettingsFromTable, restoreOtherSettings, settingsResource } = useTprSettings(
  settingsManaging,
  selectedErrorFilterOption,
  choosedBlocks,
  choosedMonths,
  choosedForceTypes,
  choosedIndexTypes,
  growingRange,
  isFullTprShowed
)
const { setManualLoading } = useLoadingState()
async function switchColumnMode(newVal: boolean) {
  setManualLoading(true)
  if (newVal) {
    await getRows(year.value, availableDepartments.value, growingRange.value, false)
  }
  setTimeout(() => {
    isFullTprShowed.value = newVal
  }, 1)
  if (newVal) setTimeout(setRenderedColumns, 10)
}

const { startEditing, emitEditingStart, addChangeRowHandler } = useTprEditing(
  getItemsByIds,
  isFullTprShowed,
  rows,
  connections,
  emit,
  addChangeRow,
  getConnections,
  year
)

defineExpose({ emitEditingStart })

getAllErrors()
const { availableDepartments } = useTprRoles()
async function getInitialData() {
  if (availableDepartments.value.length === 0) return setTimeout(getInitialData, 500)
  getConnections(year.value)
  await getRows(year.value, availableDepartments.value, growingRange.value, !isFullTprShowed.value)
}
await getInitialData()
</script>
<style lang="scss">
.prodprog {
  .tnnc-table-header-cell {
    &.index-color-main {
      background: rgb(146, 208, 80) !important;
    }
    &.index-color-blue {
      background: rgb(237, 244, 252) !important;
    }
    &.index-color-red {
      background: rgb(242, 220, 219) !important;
    }
    &.index-color-orange {
      background: rgb(253, 233, 217) !important;
    }
    &.index-color-green {
      background: rgb(235, 241, 222) !important;
    }
  }
}
.width200px {
  width: 200px;
}
.tpr-switcher.tnnc-toggle {
  flex-direction: column;
  width: 100px;
  gap: 0;
  margin-top: 5px;
  label {
    font-size: 14px;
    color: var(--tnnc-add-color-gray-3);
  }
  input[type='checkbox'] {
    transform: scale(0.7);
  }
}
.red-icon {
  color: red !important;
  cursor: default;
}
.green-icon {
  color: green !important;
  cursor: default;
}
</style>
@/widgets/handbooks/composables/useHandbooks.composable
