<template>
  <div class="container">
    <TableComponent
      :rows="slices"
      :columns="columns"
      css-class="stretch-table"
      key-expr="ID"
      allow-pagination
      allow-delete
      allow-filter
      column-chooser
      allow-toolbar
      :custom-manage-buttons="customButtons"
      @delete-row="deleteSlice"
    >
      <template #toolbar-left>
        <ButtonComponent
          text="Загрузить срез"
          icon-class="fa-solid fa-upload"
          @click="
            () => {
              uploadPopupVisible = true
            }
          "
        />
      </template>
    </TableComponent>
    <PopupComponent
      height="330px"
      width="500px"
      title="Загрузить срез"
      v-model:visible="uploadPopupVisible"
    >
      <div class="upload-form">
        <UploaderInput
          @file-changed="setFile"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <ButtonComponent
          :disabled="!fileForUpload"
          text="Загрузить срез"
          reverse
          icon-class="fa-solid fa-upload"
          @click="uploadFile"
        />
      </div>
    </PopupComponent>
    <LoaderComponent v-if="uploading" />
  </div>
</template>
<script lang="ts" setup>
import useSuppSlicesHttp from '@/composables/http/use-supp-slices-http.composable'
import { emp_moderator_url } from '@/config/urls'
import type { SuppSlice } from '@/interfaces/supp-entities/supp-slice.interface'
import {
  notify,
  TableComponent,
  type Column,
  type EditingDeleteEvent,
  confirm,
  type TableRow,
  PopupComponent,
  UploaderInput,
  ButtonComponent,
  LoaderComponent
} from 'tnnc-ui-kit'
import type { CustomManageButton } from 'tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import { ref, type Ref } from 'vue'

const { getEmpModeratorSlices, uploadEmpModeratorSlice, deleteEmpModeratorSlice } =
  useSuppSlicesHttp()
const slices: Ref<SuppSlice[]> = ref([])
function getSlices() {
  getEmpModeratorSlices().then(({ data }) => {
    slices.value = data
  })
}
getSlices()

const columns: Column[] = [
  {
    name: 'ID',
    caption: 'ID',
    columnType: 'string',
    width: 100
  },
  {
    name: 'Name',
    caption: 'Название',
    columnType: 'string'
  },
  {
    name: 'Date',
    caption: 'Дата среза',
    columnType: 'date',
    width: 200
  },
  {
    name: 'DateCreate',
    caption: 'Дата создания',
    columnType: 'date',
    width: 200
  },
  {
    name: 'AcсumMonth',
    caption: 'Месяц нарастающего итога',
    columnType: 'string',
    width: 100
  },
  {
    name: 'Version',
    caption: 'Версия',
    columnType: 'string',
    width: 100
  },
  {
    name: 'Auto',
    caption: 'Тип среза',
    columnType: 'boolean',
    trueValue: 'Авто',
    falseValue: 'Ручной',
    width: 200
  }
]

function deleteSlice(e: EditingDeleteEvent<SuppSlice>) {
  confirm('Удалить срез?').then(() => {
    deleteEmpModeratorSlice(e.row.ID)
      .then(() => {
        getSlices()
      })
      .catch(() => {})
  })
}

function downloadSlice(row: TableRow & SuppSlice) {
  window.open(`${emp_moderator_url}/FileReport/${row.ID}`)
}

const uploadPopupVisible = ref(false)
const uploading = ref(false)

const fileForUpload: Ref<null | File> = ref(null)
function setFile(files: FileList | null) {
  if (files?.length) {
    fileForUpload.value = files[0]
  } else {
    fileForUpload.value = null
  }
}

function uploadFile() {
  if (fileForUpload.value) {
    uploadPopupVisible.value = false
    uploading.value = true
    const formData = new FormData()
    formData.append('file', fileForUpload.value)
    uploadEmpModeratorSlice(formData)
      .then(({ data }) => {
        if (data === 1) {
          notify('Срез загружен успешно')
        } else {
          notify('Ошибка при загрузке среза', 'danger', 3000)
        }
        getSlices()
        uploading.value = false
        fileForUpload.value = null
      })
      .catch(() => {
        uploading.value = false
        fileForUpload.value = null
      })
  }
}

const customButtons: CustomManageButton[] = [
  {
    fn: downloadSlice,
    title: 'Скачать срез',
    icon: 'fa-solid fa-download'
  }
]
</script>
<style lang="scss">
.upload-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  .tnnc-uploader {
    height: 200px;
  }
}
</style>
