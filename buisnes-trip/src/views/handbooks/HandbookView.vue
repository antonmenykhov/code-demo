<template>
  <div class="container">
    <HandbookTable
      v-if="currentHandbookSelection.name !== 'city_extended'"
      :multiply-name="currentHandbookSelection.multiplyName"
      :name="currentHandbookSelection.name"
      :can-edit="canEdit"
      :custom-manage-buttons="customButtons"
      :key="currentHandbookSelection.multiplyName"
    >
      <template #toolbar-left>
        <SelectBox
          :options="sortedHanbookList"
          v-model:value="currentHandbookSelection"
          display-expr="display"
          value-expr="name"
          value-type="object"
          label="Справочник"
          @update:value="setQueryParam"
        />
      </template>
      <template #toolbar-right-before>
        <ButtonComponent
          v-if="isVersionHandbook && !isVersionOpened"
          text="Начать сбор"
          @click="startCollection"
        />
        <ButtonComponent
          v-if="isVersionHandbook && isVersionOpened"
          text="Завершить сбор"
          @click="endCollection"
        />
      </template>
    </HandbookTable>
    <HandbookCityExtended v-else>
      <template #toolbar-left>
        <SelectBox
          :options="sortedHanbookList"
          v-model:value="currentHandbookSelection"
          display-expr="display"
          value-expr="name"
          value-type="object"
          label="Справочник"
          @update:value="setQueryParam"
        />
      </template>
    </HandbookCityExtended>
    <PopupComponent
      width="1200px"
      height="600px"
      v-model:visible="isPopupVisible"
      :title="`Карточка города: ${currentPopupRow?.name}`"
      close-on-outside-click
    >
      <CityCard v-if="currentPopupRow" :city="currentPopupRow" />
    </PopupComponent>
    <PopupComponent
      width="500px"
      height="270px"
      v-model:visible="isNewVesionPopupVisible"
      :title="`Укажите название и дату окончания новой версии`"
      close-on-outside-click
    >
      <TextInput v-model:value="newVersionName" label="Название" />
      <DatePicker v-model:value="newVersionDateEnd" label="Дата окончания" />
      <ButtonComponent
        css-class="popup-btn"
        text="Создать копию"
        @click="createVesionCopy"
        :disabled="newVersionName === '' || newVersionDateEnd === ''"
      />
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import {
  SelectBox,
  type TableRow,
  PopupComponent,
  TextInput,
  DatePicker,
  ButtonComponent,
  confirm
} from '@tnnc/tnnc-ui-kit'
import type { City } from '@/interfaces/city.interface'
import { useRoute, useRouter } from 'vue-router'
import type { CustomManageButton } from '@tnnc/tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import CityCard from '@/components/CityCard.vue'
import HandbookTable from '@/components/HandbookTable.vue'
import type { HandbookList } from './useHandbooks.composable'
import HandbookCityExtended from '@/components/HandbookCityExtended.vue'
import type { AxiosInstance } from 'axios'
import { baseUrl } from '@/config/baseUrl'
import useHandbooks from './useHandbooks.composable'
import { titleStore } from '@/store/title.store'
import { versionStore } from '@/store/version.store'
import { storeToRefs } from 'pinia'

const route = useRoute()
onMounted(() => {
  if (route.query.handbook) {
    const handbook = handbookListForSelection.find((h) => h.name === route.query.handbook)
    if (handbook) currentHandbookSelection.value = handbook
  }
})
const currentHandbookSelection: Ref<{
  name: string
  multiplyName: keyof HandbookList
  display: string
  denyEditing?: boolean
}> = ref({
  name: 'city',
  multiplyName: 'cities' as keyof HandbookList,
  display: 'Города'
})

const sortedHanbookList = computed(() =>
  [...handbookListForSelection]
    .filter((item) => !item.hidden)
    .sort((a, b) => {
      if (a.display > b.display) return 1
      if (a.display < b.display) return -1
      return 0
    })
)

const canEdit = computed(() => !currentHandbookSelection.value.denyEditing)

const router = useRouter()
const { setTitle } = titleStore()
function setQueryParam(e: {
  name: string
  multiplyName: keyof HandbookList
  display: string
  denyEditing?: boolean
}) {
  router.push({ path: '/handbook', query: { handbook: e.name } })
  setTitle(`Справочник: ${e.display}`)
}

const customButtons: CustomManageButton[] = [
  {
    title: 'Карточка города',
    fn: (row: TableRow) => {
      // @ts-ignore
      currentPopupRow.value = row['_rawRow'] as City
      isPopupVisible.value = true
    },
    icon: 'fa-solid fa-gear',
    condition: (row) =>
      currentHandbookSelection.value.name === 'city' && row['_rawRow'] && row['id'] !== 'new'
  },
  {
    title: 'Сделать версию актуальной',
    icon: 'fa-solid fa-check',
    fn(row) {
      setActualVersion(row._rawRow.id)
    },
    condition: (row) => {
      return (
        currentHandbookSelection.value.name === 'version' && row._rawRow && !row._rawRow.is_actual
      )
    }
  },
  {
    title: 'Сделать копию версии',
    icon: 'fa-solid fa-copy',
    fn(row) {
      openNewVersionPopup(row._rawRow.id)
    },
    condition: (row) => {
      return currentHandbookSelection.value.name === 'version' && row._rawRow && row._rawRow.id
    }
  }
]

const http = inject('http') as AxiosInstance
const { getHandbook, getAllHandbooks, handbookListForSelection } = useHandbooks()
const { getVersion } = versionStore()
function setActualVersion(id: number) {
  http.post(`${baseUrl}/set_actual_version`, { id }).then(() => {
    getAllHandbooks()
    getVersion(http)
  })
}
const isNewVesionPopupVisible = ref(false)
const newVersionName = ref('')
const newVersionDateEnd = ref('')
const newVersionId = ref(0)
function createVesionCopy() {
  http
    .post(`${baseUrl}/create_version_copy/${newVersionId.value}`, {
      name: newVersionName.value,
      date_end: newVersionDateEnd.value
    })
    .then(() => {
      isNewVesionPopupVisible.value = false
      getHandbook('versions')
    })
}
function openNewVersionPopup(id: number) {
  newVersionId.value = id
  isNewVesionPopupVisible.value = true
}
const isPopupVisible = ref(false)
const currentPopupRow: Ref<null | City> = ref(null)

const { version } = storeToRefs(versionStore())
const isVersionHandbook = computed(() => currentHandbookSelection.value.name === 'version')
const isVersionOpened = computed(() => version.value?.['version_status.name'] === 'Идет сбор')
async function startCollection() {
  return confirm(`Открыть сбор для версии "${version.value?.name}"?`)
    .then(async () => {
      let sendNotification = false
      await confirm(
        'Отправить уведомления о начале сбора версии данных пользователям указанным в списке рассылки?'
      )
        .then(() => {
          sendNotification = true
        })
        .catch(() => {})
      http
        .post(`${baseUrl}/start_version_collection`, { notify: String(sendNotification) })
        .then(() => {
          getAllHandbooks()
          getVersion(http)
        })
    })
    .catch(() => {})
}
async function endCollection() {
  return confirm(`Завершить сбор для версии "${version.value?.name}"?`)
    .then(() => {
      http.post(`${baseUrl}/end_version_collection`).then(() => {
        getAllHandbooks()
        getVersion(http)
      })
    })
    .catch(() => {})
}
</script>
<style lang="scss">
.text-center {
  text-align: center;
}
.popup-btn {
  width: 100%;
  margin-top: 7px;
}
</style>
