<template>
  <Modal
    :title="editableEmail.id === 0 ? 'Добавление эл. почты' : 'Изменение эл. почты'"
    :open="opened"
    :confirm-loading="loading"
    @ok="handleOk"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="1000px"
    :ok-button-props="{ disabled: isInValidForm }"
  >
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <FormItem label="Логин" :validate-status="fieldStatuses.login">
        <Input v-model:value="editableEmail.login" />
      </FormItem>
      <FormItem label="Пароль" :validate-status="fieldStatuses.password">
        <Input v-model:value="editableEmail.password" />
      </FormItem>
      <FormItem label="Адрес сервера" :validate-status="fieldStatuses.host">
        <Input auto-size v-model:value="editableEmail.host" />
      </FormItem>
      <FormItem label="Порт" :validate-status="fieldStatuses.port">
        <Input auto-size v-model:value="editableEmail.port" />
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts" setup>
import { Modal, Input, Form, FormItem } from 'ant-design-vue'
import { computed, ref } from 'vue'
import type { Email } from '@/interfaces/email.interface'

const props = defineProps<{
  loading: boolean
}>()
const emit = defineEmits<{
  (e: 'save', changedContractor: Email): void
  (e: 'close'): void
}>()
function handleOk() {
  emit('save', editableEmail.value)
}

const opened = ref(false)
function closeHandler(e: boolean) {
  emit('close')
  opened.value = e
}

const editableEmail = ref<Email>({
  id: 0,
  host: '',
  password: '',
  login: '',
  port: 0
})

function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}

const validFields = computed<{ [key in keyof Partial<Email>]: boolean }>(() => ({
  login: isNotNull(editableEmail.value.login),
  password: !(editableEmail.value.password === '' && editableEmail.value.id === 0),
  host: isNotNull(editableEmail.value.host),
  port: isNotNull(editableEmail.value.port)
}))

const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<Email>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<Email>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})

const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<Email>)[]).some(
    (key) => validFields.value[key] === false
  )
)

function openCard(email: Email) {
  editableEmail.value = email
  opened.value = true
}

defineExpose({ openCard })
</script>
