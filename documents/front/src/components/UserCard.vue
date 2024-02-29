<template>
  <Modal
    :title="title"
    :open="opened"
    :confirm-loading="loading"
    @ok="handleOk"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="700px"
    :ok-button-props="{
      disabled: isInValidForm
    }"
  >
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :key="editableUser.id">
      <FormItem label="ФИО сотрудника" :validate-status="fieldStatuses.lastName">
        <Input v-model:value="editableUser.lastName" />
      </FormItem>
      <FormItem label="Должность сотрудника" :validate-status="fieldStatuses.firstName">
        <Input v-model:value="editableUser.firstName" />
      </FormItem>
      <FormItem label="Телефон для связи" :validate-status="fieldStatuses.username">
        <Input v-model:value="editableUser.username" />
      </FormItem>
      <FormItem label="Адрес электронной почты" :validate-status="fieldStatuses.email">
        <Input v-model:value="editableUser.email" />
      </FormItem>
      <FormItem label="Адрес эл. почты для колонтитула">
        <Input v-model:value="editableUserInfo.email" />
      </FormItem>
      <FormItem label="Роли пользователя">
        <Select
          v-model:value="editableUser.clientRoles.documents"
          :options="rolesHandbook"
          placeholder="Выберите роли пользователя"
          mode="tags"
        />
      </FormItem>
      <FormItem label="Задать пароль">
        <Switch v-model:checked="needChangePassword" />
      </FormItem>
      <FormItem label="Новый пароль" :hidden="!needChangePassword">
        <InputPassword v-model:value="editableUser.password" />
      </FormItem>
      <FormItem label="Подпись">
        <UploadDragger
          v-if="editableUser.id !== ''"
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          :action="`${base_url}/attachment`"
          :headers="{ Authorization: `Bearer ${token}` }"
          @change="handleChange"
          :class="fieldStatuses.totp"
        >
          <div class="image-uploader-content stamp">
            <img
              v-if="signForUser"
              :src="`${base_url}/attachment/${signForUser.attachmentId}?token=Bearer ${token}`"
              alt="Подпись\Пучать"
            />
            <div class="text" v-else>Нажмите, или переместите файл сюда для загрузки</div>
          </div>
        </UploadDragger>
        <div v-else>Для добавления подписи нужно сохранить пользователя</div>
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts" setup>
import { base_url } from '@/config/urls'
import type { Attachment } from '@/interfaces/attachment.interface'
import type { Role } from '@/interfaces/role.interface'
import type { UserSign } from '@/interfaces/user-sign.interface'
import type { User, UserInfo } from '@/interfaces/user.interface'
import { useUserInfoStore } from '@/stores/userInfoStore'
import {
  Modal,
  Input,
  Form,
  FormItem,
  InputPassword,
  Switch,
  Select,
  type UploadChangeParam,
  UploadDragger
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  opened: boolean
  loading: boolean
  title: string
  user: User
  roles: Role[]
  signForUser?: UserSign
  userInfo?: UserInfo
}>()
const { token } = storeToRefs(useUserInfoStore())
const emit = defineEmits<{
  (e: 'save', data: { changedUser: User; userInfo: UserInfo }): void
  (e: 'update:opened', data: boolean): void
  (
    e: 'signAttachmentUpdated',
    data: { sign?: UserSign; newAttachment: Attachment; userId: string }
  ): void
}>()
function handleOk() {
  emit('save', {
    changedUser: needChangePassword.value
      ? {
          ...editableUser.value
        }
      : {
          ...editableUser.value,
          password: '__null__'
        },
    userInfo: editableUserInfo.value
  })
}
const openedComputed = computed(() => props.user)
watch(openedComputed, (newVal) => {
  if (newVal) {
    editableUser.value = JSON.parse(JSON.stringify(newVal))
    editableUserInfo.value = props.userInfo || { id: 0, email: '', userId: editableUser.value.id }
    needChangePassword.value = false
  }
})
const editableUser = ref<User>(JSON.parse(JSON.stringify(props.user)))
const editableUserInfo = ref<UserInfo>(
  props.userInfo || { id: 0, email: '', userId: editableUser.value.id }
)
const needChangePassword = ref(false)
function closeHandler(e: boolean) {
  editableUser.value = JSON.parse(JSON.stringify(props.user))
  emit('update:opened', e)
}

const rolesHandbook = computed(() =>
  props.roles.map((role) => ({ value: role.name, label: role.description }))
)

const fileList = ref([])
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status

  if (status === 'done') {
    emit('signAttachmentUpdated', {
      sign: props.signForUser,
      newAttachment: info.file.response,
      userId: editableUser.value.id
    })
    fileList.value = []
  } else if (status === 'error') {
    console.log(status)
  }
}
function isNotNull(value: string | null | number | undefined) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ? true
    : false
}
const validFields = computed<{ [key in keyof Partial<User>]: boolean }>(() => ({
  lastName: isNotNull(editableUser.value.lastName),
  firstName: isNotNull(editableUser.value.firstName),
  username: isNotNull(editableUser.value.username),
  email: isNotNull(editableUser.value.email) && validateEmail(editableUser.value.email)
}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<User>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<User>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<User>)[]).some(
    (key) => validFields.value[key] === false
  )
)
</script>
<style lang="scss">
.image-uploader-content.stamp {
  height: 200px;
  object-fit: contain;
  img {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
}
.ant-upload.ant-upload-drag.error {
  border-color: #ff4d4f;
}
</style>
