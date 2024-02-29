<template>
  <div class="create-email-modal">
    <Modal
      title="Отправить сообщение"
      :open="opened"
      @ok="sendEmail"
      ok-text="Отправить"
      @update:open="closeHandler"
      width="700px"
      :ok-button-props="{ disabled: isInValidForm }"
      :confirm-loading="loading"
    >
      <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <FormItem label="С какой почты отправить" :validate-status="fieldStatuses.fromEmailId">
          <Select
            v-model:value="newEmailerDto.fromEmailId"
            :options="emails"
            :field-names="{ label: 'login', value: 'id', options: 'children' }"
          />
        </FormItem>
        <FormItem label="На какую почту отправить" :validate-status="fieldStatuses.toEmail">
          <Input v-model:value="newEmailerDto.toEmail" />
        </FormItem>
        <FormItem label="Тема сообщения">
          <Input v-model:value="newEmailerDto.theme" />
        </FormItem>
        <FormItem label="Текст сообщения">
          <Textarea auto-size v-model:value="newEmailerDto.message" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import type { DocumentItem } from '@/interfaces/document-item.interface'
import { useHandbookStore } from '@/stores/handbookStore'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { Select, Input, Textarea, Form, FormItem, Modal, message } from 'ant-design-vue'
import useHttp from '@/composables/useHttp.composable'

const { emails } = storeToRefs(useHandbookStore())
const props = defineProps<{
  document: DocumentItem
  opened: boolean
}>()

const emit = defineEmits<{
  (e: 'update:opened', value: boolean): void
}>()

watch(props, (newVal) => {
  if (newVal.opened) {
    newEmailerDto.value.documentId = props.document.id
    newEmailerDto.value.fromEmail =
      emails.value.find((email) => email.id === props.document.company?.defaultEmailId)?.login || ''
    newEmailerDto.value.fromEmailId =
      emails.value.find((email) => email.id === props.document.company?.defaultEmailId)?.id || ''
    newEmailerDto.value.toEmail = props.document.contractor?.email || ''
  }
})

export interface NewEmailerDto {
  documentId: number
  fromEmail: string
  toEmail: string
  message: string
  theme: string
  fromEmailId: number | ''
}

const newEmailerDto = ref<NewEmailerDto>({
  documentId: 0,
  fromEmail: '',
  toEmail: '',
  message: '',
  theme: 'Ответ на входящий запрос',
  fromEmailId: ''
})
function closeHandler() {
  emit('update:opened', false)
}
const { http } = useHttp()
const loading = ref(false)
function sendEmail() {
  loading.value = true
  http
    .post('/emailer', {
      ...newEmailerDto.value,
      fromEmail: emails.value.find((email) => email.id === newEmailerDto.value.fromEmailId)?.login
    })
    .then(() => {
      loading.value = false
      message.success('Сообщение отправлено')
      closeHandler()
    })
    .catch(() => {})
}

function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}

const validFields = computed<{ [key in keyof Partial<NewEmailerDto>]: boolean }>(() => ({
  fromEmailId: isNotNull(newEmailerDto.value.fromEmailId),
  toEmail: isNotNull(newEmailerDto.value.toEmail)
}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<NewEmailerDto>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<NewEmailerDto>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<NewEmailerDto>)[]).some(
    (key) => validFields.value[key] === false
  )
)
</script>
