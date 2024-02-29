<template>
  <Modal
    :title="title"
    :open="opened"
    :confirm-loading="loading"
    @ok="handleOk"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="900px"
    :ok-button-props="{ disabled: isInValidForm }"
  >
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" class="no-margin">
      <FormItem label="Название организации" :validate-status="fieldStatuses.name">
        <Input v-model:value="editableCompany.name" />
      </FormItem>
      <FormItem label="Реквизиты организации" :validate-status="fieldStatuses.reqisits">
        <Textarea auto-size v-model:value="editableCompany.reqisits" />
      </FormItem>
      <FormItem label="Адрес организации" :validate-status="fieldStatuses.address">
        <Textarea auto-size v-model:value="editableCompany.address" />
      </FormItem>
      <FormItem label="Адрес электронной почты" :validate-status="fieldStatuses.email">
        <Input v-model:value="editableCompany.email" />
      </FormItem>
      <FormItem label="Путь до папки сохранения">
        <Input v-model:value="editableCompany.pathToDir" />
      </FormItem>
      <FormItem label="Почта по умолчанию">
        <Select
          :value="editableCompany.defaultEmailId || ''"
          @change="(newVal) => (editableCompany.defaultEmailId = newVal ? +newVal : null)"
          :field-names="{ label: 'login', value: 'id', options: 'children' }"
          :options="emails"
        />
      </FormItem>
      <FormItem label="Подписанты">
        <table class="form-table" :class="{ isMobile }">
          <tr>
            <th style="width: 45%">Должность ФИО</th>
            <th>Попись\печать</th>
            <th></th>
          </tr>
          <tr>
            <td>
              <Textarea
                v-model:value="editableCompany.manager"
                :status="fieldStatuses.manager"
                :rows="8"
              />
            </td>
            <td>
              <UploadDragger
                :height="186"
                v-model:fileList="fileList"
                name="file"
                :multiple="false"
                :action="`${base_url}/attachment`"
                :headers="{ Authorization: `Bearer ${token}` }"
                :class="fieldStatuses.stampId"
                @change="handleChange"
              >
                <div class="image-uploader-content stamp">
                  <img
                    v-if="editableCompany.stampId"
                    :src="`${base_url}/attachment/${editableCompany.stampId}?token=Bearer ${token}`"
                    alt="Подпись\Печать"
                  />
                  <div class="text" v-else>Нажмите, или переместите файл сюда для загрузки</div>
                </div>
              </UploadDragger>
            </td>
            <td></td>
          </tr>
          <tr v-for="(signer, index) in editableCompany.additionalSigners" :key="index">
            <td>
              <Textarea v-model:value="signer.name" :rows="8" />
            </td>
            <td>
              <UploadDragger
                :height="186"
                v-model:fileList="fileList"
                name="file"
                :multiple="false"
                :action="`${base_url}/attachment`"
                :headers="{ Authorization: `Bearer ${token}` }"
                @change="(e) => handleChangeSignerStamp(e, index)"
              >
                <div class="image-uploader-content stamp">
                  <img
                    v-if="signer.stampId"
                    :src="`${base_url}/attachment/${signer.stampId}?token=Bearer ${token}`"
                    alt="Подпись\Печать"
                  />
                  <div class="text" v-else>Нажмите, или переместите файл сюда для загрузки</div>
                </div>
              </UploadDragger>
            </td>
            <td>
              <Button @click="deleteSigner(index)">
                <MinusCircleOutlined />
              </Button>
            </td>
          </tr>
        </table>
        <Button block @click="addSigner">Добавить подписанта</Button>
      </FormItem>
      <FormItem label="Шапка документов" :validate-status="fieldStatuses.headerId">
        <UploadDragger
          :fileList="fileList"
          name="file"
          :multiple="false"
          :action="`${base_url}/attachment`"
          :headers="{ Authorization: `Bearer ${token}` }"
          :class="fieldStatuses.headerId"
          @change="handleChangeHeader"
        >
          <div class="image-uploader-content stamp">
            <img
              v-if="editableCompany.headerId"
              :src="`${base_url}/attachment/${editableCompany.headerId}?token=Bearer ${token}`"
              alt="Шапка документов"
            />
            <div class="text" v-else>Нажмите, или переместите файл сюда для загрузки</div>
          </div>
        </UploadDragger>
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts" setup>
import { base_url } from '@/config/urls'
import type { Company } from '@/interfaces/company.interface'
import type { Email } from '@/interfaces/email.interface'
import { useModeStore } from '@/stores/modeStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { MinusCircleOutlined } from '@ant-design/icons-vue'
import {
  Modal,
  Input,
  Form,
  FormItem,
  Textarea,
  UploadDragger,
  Select,
  Button,
  type UploadChangeParam
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const { isMobile } = storeToRefs(useModeStore())
const props = defineProps<{
  opened: boolean
  loading: boolean
  title: string
  company: Company
  emails: Email[]
}>()
const emit = defineEmits<{
  (e: 'save', changedCompany: Company): void
  (e: 'update:opened', data: boolean): void
}>()
function handleOk() {
  emit('save', editableCompany.value)
}
const openedComputed = computed(() => props.company)
watch(openedComputed, (newVal) => {
  if (newVal) {
    editableCompany.value = JSON.parse(JSON.stringify(props.company))
  }
})
const editableCompany = ref<Company>(JSON.parse(JSON.stringify(props.company)))
function closeHandler(e: boolean) {
  editableCompany.value = JSON.parse(JSON.stringify(props.company))
  emit('update:opened', e)
}

const { token } = storeToRefs(useUserInfoStore())
const fileList = ref([])
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status !== 'done') {
    editableCompany.value.stampId = 0
    editableCompany.value.stamp = undefined
  }
  if (status === 'done') {
    editableCompany.value.stamp = info.file.response
    editableCompany.value.stampId = info.file.response?.id || 0
    fileList.value = []
  } else if (status === 'error') {
    console.log(status)
  }
}

const handleChangeSignerStamp = (info: UploadChangeParam, signerIndex: number) => {
  const status = info.file.status
  if (status !== 'done') {
    editableCompany.value.additionalSigners[signerIndex].stampId = 0
    editableCompany.value.additionalSigners[signerIndex].stamp = undefined
  }
  if (status === 'done') {
    editableCompany.value.additionalSigners[signerIndex].stamp = info.file.response
    editableCompany.value.additionalSigners[signerIndex].stampId = info.file.response?.id || 0
    fileList.value = []
  } else if (status === 'error') {
    console.log(status)
  }
}

const handleChangeHeader = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status !== 'done') {
    editableCompany.value.headerId = null
    editableCompany.value.header = undefined
  }
  if (status === 'done') {
    editableCompany.value.header = info.file.response
    editableCompany.value.headerId = info.file.response?.id || 0
    fileList.value = []
  } else if (status === 'error') {
    console.log(status)
  }
}
function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}
const validFields = computed<{ [key in keyof Partial<Company>]: boolean }>(() => ({
  name: isNotNull(editableCompany.value.name),
  manager: isNotNull(editableCompany.value.manager),
  reqisits: isNotNull(editableCompany.value.reqisits),
  address: isNotNull(editableCompany.value.address),
  email: isNotNull(editableCompany.value.email),
  stampId: isNotNull(editableCompany.value.stampId),
  headerId: isNotNull(editableCompany.value.headerId)
}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<Company>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<Company>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<Company>)[]).some(
    (key) => validFields.value[key] === false
  )
)

function deleteSigner(index: number) {
  editableCompany.value.additionalSigners.splice(index, 1)
}
function addSigner() {
  editableCompany.value.additionalSigners.push({
    companyId: editableCompany.value.id,
    name: '',
    id: 0,
    stampId: null
  })
}
</script>
<style lang="scss">
.image-uploader-content.stamp {
  height: 200px;
  img {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
}
.ant-upload.ant-upload-drag.error {
  border-color: #ff4d4f;
}
.no-margin {
  .ant-form-item {
    margin-bottom: 5px;
  }
}
</style>
