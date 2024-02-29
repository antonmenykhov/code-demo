<template>
  <TableComponent
    ref="table"
    :rows="rows"
    :columns="columns"
    :key-expr="idExpr"
    css-class="stretch-table report-table"
    allow-toolbar
    allow-grouping
    allow-filter
    allow-fixing
    allow-sorting
    allow-column-numeration
    additional-features
    hide-zero-numbers
    column-chooser
    :allow-export="allowExportComputed"
    :number-formating-ed="numberFormatingEd"
    :number-formating-razryad="numberFormatingRazryad"
    :export-name="exportName"
    :allow-add="allowAdd"
    :allow-edit="allowEdit"
    :allow-delete="allowDelete"
    @updated="tableUpdated"
    @settings-changed="saveSettingsFromTable"
    @delete-row="emitDeleteRow"
    @save-row="emitSaveRow"
    @start-editing="emitStartEditing"
    @stop-editing="emitStopEditing"
  >
    <template #toolbar-left>
      <slot name="toolbar-left"></slot>
    </template>
    <template #toolbar-right>
      <SettingsManaging
        ref="settingsManaging"
        :resource="resourceName"
        :table-ref="table"
        @settings-loaded="restoreOtherSettings"
        @settings-list-loaded="emitSettingsLoaded"
      />
      <slot name="toolbar-right"></slot>
    </template>
    <template #toolbar-right-before>
      <slot name="toolbar-right-before"></slot>
    </template>
  </TableComponent>
</template>
<script lang="ts" setup>
import {
  type Column,
  TableComponent,
  type TableSettings,
  type EditingDeleteEvent,
  type EditigngSaveEvent,
  type EditingStartEvent,
  type EditigngStopEvent
} from 'tnnc-ui-kit'
import { computed, ref, watch } from 'vue'
import SettingsManaging from '@/components/general/SettingsManaging.vue'
import { storeToRefs } from 'pinia'
import { useLockStore } from '@/store/lock.store'
import { useDateFormat } from '@vueuse/core'
import { useLoadingState } from '@/store/loading.state'

export interface SettingsRecord {
  [key: string]:
    | string
    | number
    | boolean
    | SettingsRecord
    | string[]
    | number[]
    | boolean[]
    | SettingsRecord[]
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: any[]
    resourceName: string
    idExpr?: string
    settingsForSave?: SettingsRecord
    numberFormatingEd?: number
    numberFormatingRazryad?: number
    allowExport?: boolean
    allowEdit?: boolean
    allowAdd?: boolean
    allowDelete?: boolean
  }>(),
  { idExpr: 'id', allowExport: undefined }
)

const emit = defineEmits<{
  (e: 'updated'): void
  (e: 'update:settingsForSave', data: SettingsRecord): void
  (e: 'settingsLoaded'): void
  <T>(e: 'deleteRow', data: EditingDeleteEvent<T>): void
  <T>(e: 'saveRow', data: EditigngSaveEvent<T>): void
  <T>(e: 'startEditing', data: EditingStartEvent<T>): void
  <T>(e: 'stopEditing', data: EditigngStopEvent<T>): void
}>()

const { manualLoading } = storeToRefs(useLoadingState())
function tableUpdated() {
  manualLoading.value = false
  emit('updated')
}

const table = ref<InstanceType<typeof TableComponent>>()
const settingsManaging = ref<InstanceType<typeof SettingsManaging>>()
function saveSettingsFromTable(tableSettings: TableSettings) {
  if (settingsManaging.value) return settingsManaging.value.saveCurrentSettings({ tableSettings })
}
function isSettingsRecord(value: any): value is SettingsRecord {
  return typeof value === 'object' && value !== null
}
function restoreOtherSettings(settings: {
  tableSettings: TableSettings
  otherSettings: unknown
  isNew?: boolean | undefined
}) {
  if (isSettingsRecord(settings.otherSettings)) {
    emit('update:settingsForSave', { ...props.settingsForSave, ...settings.otherSettings })
  } else {
    emitSettingsLoaded()
  }
}
function emitSettingsLoaded() {
  emit('settingsLoaded')
}
function saveOtherSettings() {
  if (settingsManaging.value && props.settingsForSave)
    return settingsManaging.value.saveCurrentSettings<SettingsRecord>({
      otherSettings: props.settingsForSave
    })
}
const otherSettings = computed(() => props.settingsForSave)
watch(otherSettings, saveOtherSettings, { deep: true })

const { isAdmin, isEconomist, isZgd } = storeToRefs(useLockStore())
const allowExportComputed = computed(() =>
  props.allowExport !== undefined
    ? props.allowExport
    : isAdmin.value || isEconomist.value || isZgd.value
)
const exportName = computed(
  () => `${document.title} ${useDateFormat(new Date(), 'DD-MM-YYYY').value}`
)

function emitDeleteRow<T>(e: EditingDeleteEvent<T>) {
  emit('deleteRow', e)
}
function emitSaveRow<T>(e: EditigngSaveEvent<T>) {
  emit('saveRow', e)
}
function emitStartEditing<T>(e: EditingStartEvent<T>) {
  emit('startEditing', e)
}
function emitStopEditing<T>(e: EditigngStopEvent<T>) {
  emit('stopEditing', e)
}
</script>
