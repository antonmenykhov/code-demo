<template>
  <div class="settings-managing">
    <ButtonComponent v-show="false" text="d" />
    <ButtonComponent text="Настройки" @click="() => (isPopupVisible = true)" />
    <PopupComponent
      width="300px"
      height="auto"
      v-model:visible="isPopupVisible"
      title="Настройки"
      close-on-outside-click
    >
      <div v-if="mode">
        <SelectBox
          :options="settingsSet"
          v-model:value="currentSet"
          label="Набор настроек"
          value-expr="id"
          display-expr="name"
        />
        <ButtonComponent css-class="button-with-margin" text="Применить" @click="applySelected" />
        <ButtonComponent
          css-class="button-with-margin"
          text="Записать"
          @click="saveCurrentSelected"
        />
        <ButtonComponent
          css-class="button-with-margin"
          text="Сбросить настройки"
          @click="flushSettings"
        />
        <ButtonComponent
          css-class="button-with-margin"
          text="Удалить"
          type="danger"
          :disabled="isCurrent"
        />
        <ButtonComponent css-class="button-with-margin" text="Новый набор" @click="toggleMode" />
      </div>
      <div v-else>
        <TextInput label="Название набора" v-model:value="newSetName" />
        <ButtonComponent
          css-class="button-with-margin"
          type="success"
          text="Сохранить"
          @click="saveNewSet"
        />
        <ButtonComponent
          css-class="button-with-margin"
          type="danger"
          text="Отмена"
          @click="toggleMode"
        />
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import useSettingsHttp from '@/composables/http/use-settings-http.composable'
import type {
  SettingsItem,
  SettingsItemTiny
} from '@/interfaces/help-entities/settings-item.interface'
import {
  ButtonComponent,
  PopupComponent,
  SelectBox,
  TableComponent,
  TextInput,
  type TableSettings,
  TableColumn,
  confirm
} from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  resource: string
  tableRef?: InstanceType<typeof TableComponent>
}>()

const { getOneSettingsSet, getSettingsSetsByResource, createNewSettingsSet, updateSettingsSet } =
  useSettingsHttp()

const emit = defineEmits<{
  <T>(
    e: 'settingsLoaded',
    settings: {
      tableSettings: TableSettings
      otherSettings: T
      isNew?: boolean
    }
  ): void
  (e: 'settingsListLoaded'): void
}>()

const isPopupVisible = ref(false)
const settingsSet = ref<SettingsItemTiny[]>([])
const currentSet = ref(1)

const settingsLoaded = ref(false)
const currentSettings = ref<SettingsItem>({
  id: 0,
  userId: '',
  name: '',
  resource: '',
  settings: {
    tableSettings: {
      collapsedColumnsIds: [],
      currentFilter: [],
      currentPage: 1,
      customColumnWidths: [],
      selectedRowsIds: [],
      sortedColumns: [],
      pageSize: 25,
      renderedColumnsIds: [],
      editingRowIds: [],
      expandedGroupNames: [],
      expandedRows: [],
      fixedColumnIds: [],
      groupedColumnIds: [],
      masterDetailOpened: []
    },
    otherSettings: {},
    isNew: true
  }
})

async function getSettingsSet() {
  return getSettingsSetsByResource(props.resource).then(({ data }) => {
    settingsSet.value = data
    applyPreviosSettings()
  })
}

async function applyPreviosSettings() {
  const savedInLSvalue = window.localStorage.getItem(props.resource)
  if (savedInLSvalue !== null && settingsSet.value.find((set) => set.id === +savedInLSvalue)) {
    currentSet.value = +savedInLSvalue
    await loadCurrentSetting(currentSet.value)
    settingsLoaded.value = true
    return
  }
  if (settingsSet.value.length > 0) {
    currentSet.value = settingsSet.value[0].id
    await loadCurrentSetting(currentSet.value)
    settingsLoaded.value = true
    return
  }
  settingsLoaded.value = true
  emit('settingsListLoaded')
}

async function loadCurrentSetting(id: number) {
  window.localStorage.setItem(props.resource, `${id}`)
  return getOneSettingsSet(id).then(({ data }) => {
    if (data.settings.isNew) {
      currentSettings.value = data
      emit('settingsLoaded', data.settings)
      if (props.tableRef) {
        props.tableRef.setSettings(data.settings.tableSettings)
      }
    }
  })
}

async function saveCurrentSettings<T = any>(
  newSettings: Partial<{
    tableSettings: TableSettings
    otherSettings: T
    isNew?: boolean
  }>
) {
  if (!settingsLoaded.value) return
  currentSettings.value = {
    ...currentSettings.value,
    settings: { ...currentSettings.value.settings, ...newSettings }
  }
  if (currentSetId.value) {
    await updateSet(currentSetId.value)
  } else {
    await createNewSet('Текущий набор')
  }
  if (currentSetId.value) {
    window.localStorage.setItem(props.resource, `${currentSetId.value}`),
      (currentSet.value = currentSetId.value)
  }
}

async function createNewSet(name: string) {
  settingsLoaded.value = false
  return createNewSettingsSet(currentSettings.value, props.resource, name).then(({ data }) => {
    currentSet.value = data.id
    settingsSet.value.push(data)
    currentSettings.value = data
    settingsLoaded.value = true
  })
}

async function updateSet(id: number) {
  return updateSettingsSet(id, currentSettings.value)
}

const currentSetId = computed(
  () => settingsSet.value.find((set) => set.name === 'Текущий набор')?.id
)
const isCurrent = computed(() => currentSettings.value.name === 'Текущий набор')

function saveCurrentSelected() {
  updateSet(currentSet.value)
}

function applySelected() {
  loadCurrentSetting(currentSet.value)
}

const tableColumnsPlain = (tableColumnsTree: TableColumn[]) => {
  const getColumnsPlain = (columns: TableColumn[]) => {
    const newColumnsArray: TableColumn[] = []
    columns.forEach((column) => {
      const newColumn = { ...column }
      if (newColumn.child?.length) {
        newColumnsArray.push(...getColumnsPlain(newColumn.child))
      } else {
        newColumnsArray.push(newColumn)
      }
    })
    return newColumnsArray
  }
  return getColumnsPlain(tableColumnsTree)
}

const router = useRouter()
async function flushSettings() {
  confirm('Страница будет перезагружена, продолжить?')
    .then(async () => {
      if (props.tableRef) {
        currentSettings.value.settings.tableSettings = {
          collapsedColumnsIds: [],
          currentFilter: [],
          currentPage: 1,
          customColumnWidths: [],
          selectedRowsIds: [],
          sortedColumns: [],
          pageSize: 25,
          renderedColumnsIds: tableColumnsPlain(props.tableRef.tableColumnsTree).map(
            (column) => column.id
          ),
          editingRowIds: [],
          expandedGroupNames: [],
          expandedRows: [],
          fixedColumnIds: [],
          groupedColumnIds: [],
          masterDetailOpened: []
        }
      }
      currentSettings.value.settings.otherSettings = {}
      await saveCurrentSettings(currentSettings.value.settings)
      router.go(0)
    })
    .catch(() => {})
}

const mode = ref(true)
function toggleMode() {
  mode.value = !mode.value
}
const newSetName = ref('')
function saveNewSet() {
  createNewSet(newSetName.value).then(() => {
    toggleMode()
  })
}

getSettingsSet()
defineExpose({ saveCurrentSettings })
</script>
<style lang="scss">
.settings-managing {
  .tnnc-button {
    width: 100%;
  }
}
.button-with-margin {
  margin-top: 5px;
  width: 100%;
}
</style>
