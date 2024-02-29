<template>
  <div class="file-managment-cell">
    <UploaderInput
      v-if="canEdit"
      placeholder="Кликните для загрузки, или переместите сюда"
      @file-changed="uploadFile"
      css-class="file-uploader"
    />
    <ul v-if="row._rawRow || row.documents">
      <li class="file-item" v-for="file in documentList" :key="file.id">
        <a :href="`${baseUrl.baseUrl}${file.path}`" target="_blank" download>{{ file.fileName }}</a>
        <ButtonComponent
          v-if="canEdit"
          icon-class="fa-solid fa-close"
          type="danger"
          css-class="small-button"
          @click="deleteFile(file.id)"
        />
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { ActionReportRow } from '@/interfaces/action-report-row.interface'
import type { File } from '@/interfaces/file.interface'
import type { AxiosInstance } from 'axios'
import { ButtonComponent, UploaderInput } from 'tnnc-ui-kit'
import { computed, ref, type Ref } from 'vue'

const props = defineProps<{
  row: ActionReportRow & { _rawRow: ActionReportRow }
  meta: {
    isResponsible: boolean
    isAdministrator: boolean
    isManager: boolean
    http: AxiosInstance
  }
  isEditing?: boolean
}>()

const tempDocuments: Ref<File[]> = ref([])
const deletedDocumentsIds = ref(new Set<number>())
const documentList = computed(() =>
  [
    ...(props.isEditing ? props.row.documents : props.row._rawRow.documents || []),
    ...tempDocuments.value
  ].filter((document) => !deletedDocumentsIds.value.has(document.id))
)

const canEdit = computed(
  () =>
    (props.meta.isAdministrator && props.isEditing) ||
    (props.meta.isResponsible &&
      props.isEditing &&
      (props.isEditing
        ? props.row.stateId >= 6 && props.row.stateId <= 8
        : props.row._rawRow.stateId >= 6 && props.row.stateId <= 8))
)

async function uploadFile(data: FileList | null) {
  if (data) {
    const { meta } = props
    const { http } = meta
    const formData = new FormData()
    formData.append('actionId', `${props.row.correctAction?.id}`)
    formData.append('file', data[0])
    formData.append('fileName', data[0].name)
    http.post(`${baseUrl.baseUrl}/file`, formData).then(({ data }) => {
      tempDocuments.value.push(data)
      createUpdateCommand()
    })
  }
}

async function deleteFile(id: number) {
  const { meta } = props
  const { http } = meta
  http.delete(`${baseUrl.baseUrl}/file/${id}`).then(() => {
    deletedDocumentsIds.value.add(id)
    createUpdateCommand()
  })
}

function createUpdateCommand() {
  const event = new Event('need-update-rows')
  document.dispatchEvent(event)
}
</script>
<style lang="scss">
.file-uploader {
  height: 100px;
}
.file-managment-cell {
  .small-button {
    height: 20px;
    font-size: 12px;
  }
  .file-item {
    display: flex;
    gap: 5px;
    margin-bottom: 5px;
    width: 100%;
    overflow: hidden;
    a {
      word-break: keep-all;
      overflow: hidden;
      flex: 1;
      text-overflow: ellipsis;
    }
  }
}
</style>
