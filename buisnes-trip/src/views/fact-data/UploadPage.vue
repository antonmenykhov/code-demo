<template>
  <div>
    <UploaderInput css-class="sap-uploader" @file-changed="uploadFile" />
    <TableComponent
      :rows="collection"
      :columns="columns"
      css-class="uploader-table"
      allow-pagination
      allow-toolbar
      allow-filter
      allow-sorting
      allow-grouping
      allow-fixing
      column-chooser
      ref="table"
      :custom-manage-buttons="buttons"
    >
      <template #toolbar-left> <h3>Список загруженных файлов</h3></template>
    </TableComponent>
    <PopupComponent
      v-model:visible="isInfoPopupVisible"
      @update:visible="onClosePopup"
      height="90vh"
      width="90vw"
      close-on-outside-click
    >
      <TableComponent
        v-if="isContentVisible"
        :rows="rowsForInfo"
        :columns="columnsForInfo"
        css-class="file-info"
        allow-pagination
        allow-toolbar
        allow-filter
        allow-sorting
        allow-grouping
        allow-fixing
        column-chooser
      >
        <template #toolbar-left>
          <h4>Всего строк: {{ rowsForInfo.length }}</h4>
        </template>
      </TableComponent>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import { baseUrl } from '@/config/baseUrl'
import { handbooksStore } from '@/store/hanbooks.store'
import type { AxiosInstance } from 'axios'
import { storeToRefs } from 'pinia'
import {
  UploaderInput,
  type Column,
  TableComponent,
  type TableRow,
  PopupComponent
} from '@tnnc/tnnc-ui-kit'
import type { CustomManageButton } from '@tnnc/tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import { computed, inject, ref } from 'vue'

export type SapFile = {
  deleted: null | string
  deleted_by: null | string
  file_name: null | string
  id: null | number
  modified_by: null | string
  uploaded_date: null | string
  user_id: null | number
  get_file_contents: string
}

const { handbooks } = storeToRefs(handbooksStore())
const http = inject('http') as AxiosInstance
const collection = ref<SapFile[]>([])
async function getSapFiles() {
  return http.get(`${baseUrl}/list_all/sap_file`).then(({ data }) => {
    collection.value = data
  })
}
async function uploadFile(files: FileList | null) {
  if (files) {
    const formData = new FormData()
    formData.append('file', files[0])
    return http.post(`${baseUrl}/upload_file`, formData).then(() => {
      getSapFiles()
    })
  }
}
getSapFiles()
const columns: Column[] = [
  {
    name: 'file_name',
    caption: 'Наименование файла',
    columnType: 'string'
  },
  {
    name: 'uploaded_date',
    caption: 'Дата загрузки',
    columnType: 'date'
  },
  {
    name: 'user_id',
    caption: 'Пользователь',
    columnType: 'enum',
    lookup: {
      handbook: handbooks.value.users,
      valueExpr: 'id',
      idExpr: 'id',
      displayExpr: 'fio'
    }
  }
]

const buttons: CustomManageButton[] = [
  {
    icon: 'fa-solid fa-info',
    title: 'Данные документа',
    fn: (row) => showInfo(row)
  }
]

const isInfoPopupVisible = ref(false)
const isContentVisible = ref(false)
const rowsForInfo = ref<any[]>([])
const columnsForInfo = computed(() => {
  const columns: Column[] = []
  Object.keys(rowsForInfo.value[0] || {}).forEach((key) => {
    if (key.includes('col')) {
      columns.push({
        name: key,
        caption: key,
        columnType: 'string'
      })
    }
  })

  return columns
})
async function showInfo(row: TableRow) {
  await getRows(row._rawRow.get_file_contents as string)
  isInfoPopupVisible.value = true
  setTimeout(() => {
    isContentVisible.value = true
  }, 200)
}
async function getRows(url: string) {
  return http.get(`${baseUrl}${url}`).then(({ data }) => {
    rowsForInfo.value = data
  })
}
function onClosePopup() {
  isContentVisible.value = false
  isInfoPopupVisible.value = false
}
</script>
<style>
.uploader-table {
  height: calc(100vh - 150px);
}
.file-info {
  height: 83vh;
}
</style>
