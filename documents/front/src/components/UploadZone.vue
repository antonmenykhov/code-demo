<template>
  <UploadDragger
    v-model:fileList="fileList"
    name="file"
    :multiple="false"
    :action="`${base_url}/attachment`"
    :headers="{ Authorization: `Bearer ${token}` }"
    @change="handleChange"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="ant-upload-text">Нажмите, или переместите файл сюда для загрузки</p>
  </UploadDragger>
</template>
<script lang="ts" setup>
import { base_url } from '@/config/urls'
import type { Attachment } from '@/interfaces/attachment.interface'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { InboxOutlined } from '@ant-design/icons-vue'
import { type UploadChangeParam, message, UploadDragger } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { token } = storeToRefs(useUserInfoStore())

const emit = defineEmits<{
  (e: 'uploadingStart'): void
  (e: 'uploaded', data: Attachment): void
}>()

const fileList = ref([])
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status !== 'done') {
    emit('uploadingStart')
  }
  if (status === 'done') {
    emit('uploaded', info.file.response)
    fileList.value = []
    message.success(`${info.file.name} файл загружен`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}
</script>
<style lang="scss">
.ant-upload.ant-upload-drag.css-dev-only-do-not-override-kqecok,
.ant-upload.ant-upload-btn {
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
