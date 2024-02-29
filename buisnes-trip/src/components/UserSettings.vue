<template>
  <div class="table-settings">
    <DropDownButton
      title="Настройки"
      icon="fa-solid fa-gear"
      list-css-class="settings-dropdown-list"
    >
      <div class="settings-list">
        <div
          class="settings-item"
          v-for="settingItem in availableFormatedUserSettings"
          :key="settingItem.id"
        >
          <Checkbox
            title="Выбрать"
            :key="choosedSettingsSet?.id"
            :value="settingItem.id === choosedSettingsSet?.id"
            @update:value="(value) => chooseSettings(settingItem, value)"
          />
          <div class="name">{{ settingItem.settings_values?.settingsName || 'Без названия' }}</div>
          <ButtonComponent
            v-if="userName === settingItem.username"
            title="Редактировать"
            icon-class="fa-solid fa-pen"
            css-class="small-button"
            @click="showNamingPopup(settingItem)"
          />
          <ButtonComponent
            v-if="!settingItem.is_common"
            title="Открыть для всех"
            icon-class="fa-solid fa-chain"
            css-class="small-button"
            @click="shareSettingsSet(settingItem)"
          />
          <ButtonComponent
            v-if="userName === settingItem.username"
            title="Удалить"
            icon-class="fa-solid fa-trash"
            css-class="small-button"
            type="danger"
            @click="deleteSettingsSet(settingItem)"
          />
        </div>
        <h5 v-if="availableFormatedUserSettings.length === 0">Доступных наборов нет</h5>
        <ButtonComponent
          title="Добавить"
          icon-class="fa-solid fa-plus"
          reverse
          text="Добавить набор"
          css-class="add-settings-button"
          type="success"
          @click="showNamingPopup()"
        />
      </div>
    </DropDownButton>
    <PopupComponent
      title="Наименование"
      close-on-outside-click
      v-model:visible="isPopupShowed"
      width="400px"
      height="fit-content"
    >
      <TextInput
        v-model:value="newSettingsName"
        label="Наименование набора настроек"
        :invalid="cantSaveSet"
        invalid-text="Минимальный размер - 3 символа"
      />
      <div class="buttons-row">
        <ButtonComponent
          :disabled="cantSaveSet"
          type="success"
          text="Сохранить"
          @click="saveSettings(newSettingsName)"
        />
        <ButtonComponent type="danger" text="Отмена" @click="isPopupShowed = false" />
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import { baseUrl } from '@/config/baseUrl'
import type {
  UserSettings,
  UserSettingsFormated,
  UserSettingsFormat
} from '@/interfaces/user-settings.interface'
import { roleStore } from '@/store/role.store'
import type { AxiosInstance } from 'axios'
import { storeToRefs } from 'pinia'
import {
  ButtonComponent,
  DropDownButton,
  PopupComponent,
  TextInput,
  type TableComponent,
  Checkbox,
  confirm
} from '@tnnc/tnnc-ui-kit'
import { computed, inject, ref, watch } from 'vue'

const { userName } = storeToRefs(roleStore())
const props = defineProps<{
  resource: string
  table?: InstanceType<typeof TableComponent>
}>()
const allUserSettings = ref<UserSettings[]>([])
const availableFormatedUserSettings = computed<UserSettingsFormated[]>(() =>
  allUserSettings.value
    .filter(
      (settings) =>
        (settings.username === userName.value || settings.is_common) &&
        settings.interface_table_name === props.resource
    )
    .map<UserSettingsFormated>((settings) => ({
      ...settings,
      settings_values: JSON.parse(settings.settings_values) as UserSettingsFormat
    }))
)
const choosedSettingsSet = ref<UserSettingsFormated>()
const currentTableSettings = computed(() => props.table?.tableSettings)
const cantSaveSet = computed(() => newSettingsName.value.length < 3)
const isPopupShowed = ref<boolean>(false)
const newSettingsName = ref<string>('')
function showNamingPopup(settingsSet?: UserSettingsFormated) {
  choosedSettingsSet.value = settingsSet
  isPopupShowed.value = true
  newSettingsName.value = settingsSet?.settings_values.settingsName || ''
}

const http = inject('silentHttp') as AxiosInstance

async function updateSettingsSet(settinsSet: UserSettingsFormated, newSettingsName?: string) {
  return http.put<UserSettings>(`${baseUrl}/update/userinterfacesettings`, {
    ...settinsSet,
    settings_values: JSON.stringify({
      settings: currentTableSettings.value,
      settingsName: newSettingsName || settinsSet.settings_values.settingsName
    })
  })
}

async function addSettingsSet(newSettingsName: string) {
  return http.post<UserSettings, any, Omit<UserSettings, 'id'>>(
    `${baseUrl}/add/userinterfacesettings`,
    {
      settings_values: JSON.stringify({
        settings: currentTableSettings.value,
        settingsName: newSettingsName
      }),
      username: userName.value,
      interface_table_name: props.resource,
      is_common: false
    }
  )
}

async function removeSettingsSet(id: number) {
  return http.delete(`${baseUrl}/delete/userinterfacesettings`, { data: { id } })
}

async function saveSettings(newSettingsName?: string) {
  if (
    choosedSettingsSet.value &&
    currentTableSettings.value &&
    choosedSettingsSet.value.username === userName.value
  ) {
    updateSettingsSet(choosedSettingsSet.value, newSettingsName).then(({ data }) => {
      allUserSettings.value.splice(
        allUserSettings.value.findIndex((settings) => settings.id === data.id),
        1,
        data
      )
      isPopupShowed.value = false
      choosedSettingsSet.value = { ...data, settings_values: JSON.parse(data.settings_values) }
      localStorage.setItem(localStorageSavedSetName.value, String(data.id))
    })
  } else {
    if (newSettingsName && currentTableSettings.value) {
      addSettingsSet(newSettingsName).then(({ data }) => {
        allUserSettings.value.push(data)
        isPopupShowed.value = false
        choosedSettingsSet.value = { ...data, settings_values: JSON.parse(data.settings_values) }
        localStorage.setItem(localStorageSavedSetName.value, String(data.id))
      })
    }
  }
}
async function getSettingsList() {
  http.get<UserSettings[]>(`${baseUrl}/list_all/userinterfacesettings`).then(({ data }) => {
    allUserSettings.value = data
    const settingsItem = data.find(
      (settings) => settings.id === +(localStorage.getItem(localStorageSavedSetName.value) || 0)
    )
    if (settingsItem) {
      chooseSettings(
        {
          ...settingsItem,
          settings_values: JSON.parse(settingsItem.settings_values)
        },
        true
      )
    } else {
      localStorage.removeItem(localStorageSavedSetName.value)
    }
  })
}
getSettingsList()

watch(currentTableSettings, () => saveSettings(), { deep: true })

async function chooseSettings(settingsSet: UserSettingsFormated, checked: boolean) {
  if (checked) {
    choosedSettingsSet.value = settingsSet
    if (props.table) {
      props.table.setSettings(settingsSet.settings_values.settings)
      localStorage.setItem(localStorageSavedSetName.value, String(settingsSet.id))
    }
  } else {
    choosedSettingsSet.value = undefined
    localStorage.removeItem(localStorageSavedSetName.value)
  }
}

async function shareSettingsSet(settingsSet: UserSettingsFormated) {
  confirm('Набор станет доступен всем пользователям, продолжить?').then(() => {
    updateSettingsSet({ ...settingsSet, is_common: true }).then(({ data }) => {
      allUserSettings.value.splice(
        allUserSettings.value.findIndex((settings) => settings.id === data.id),
        1,
        data
      )
    })
  })
}
async function deleteSettingsSet(settingsSet: UserSettingsFormated) {
  confirm('Удалить набор настроек?').then(() => {
    removeSettingsSet(settingsSet.id).then(() => {
      allUserSettings.value.splice(
        allUserSettings.value.findIndex((settings) => settings.id === settingsSet.id),
        1
      )
      if (settingsSet.id === choosedSettingsSet.value?.id) {
        choosedSettingsSet.value = undefined
        localStorage.removeItem(localStorageSavedSetName.value)
      }
    })
  })
}

const localStorageSavedSetName = computed(() => `${props.resource}${userName.value}`)
</script>
<style lang="scss">
.settings-dropdown-list {
  width: 350px !important;
  padding: 10px;
  overflow: hidden;
  height: fit-content;
  h5 {
    font-weight: 400;
  }
}
.settings-list {
  height: 100%;
  overflow: auto;
  width: 100%;

  .settings-item {
    margin-bottom: 5px;
    display: flex;
    gap: 5px;
    align-items: center;
    .name {
      flex: 1;
    }
  }
}
.add-settings-button {
  padding: 5px 10px;
  font-size: 12px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: 0;
  box-shadow: none !important;
}
.buttons-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 5px;
}
.small-button {
  padding: 3px !important;
  height: fit-content;
  width: fit-content;
  box-shadow: none !important;
  i {
    font-size: 12px;
  }
}
</style>
