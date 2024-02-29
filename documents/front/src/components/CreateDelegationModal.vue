<template>
  <Modal
    title="Создать поручение"
    :open="opened"
    @ok="handleOk"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="700px"
    :ok-button-props="{ disabled: isInValidForm }"
  >
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <FormItem label="Адресат" :validate-status="fieldStatuses.toId">
        <Select
          v-model:value="toIds"
          :options="userHandbook"
          show-search
          optionFilterProp="label"
          :mode="'multiple'"
        />
      </FormItem>
      <FormItem label="Срок до" :validate-status="fieldStatuses.date">
        <DatePicker
          v-model:value="editableDelegation.date"
          format="DD.MM.YYYY"
          value-format="YYYY-MM-DDTHH:mm:ssZ[Z]"
        />
      </FormItem>
      <FormItem label="Комментарий" :validate-status="fieldStatuses.description">
        <Textarea auto-size v-model:value="editableDelegation.description" />
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts" setup>
import useDelegationWork from '@/composables/useDelegationWork.composable'
import type { Delegation } from '@/interfaces/delegation.interface'
import type { DocumentItem } from '@/interfaces/document-item.interface'
import { useHandbookStore } from '@/stores/handbookStore'
import { Modal, Form, FormItem, Textarea, Select, DatePicker } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const toIds = ref<string[]>([])
const { users } = storeToRefs(useHandbookStore())
const { initDelegation, createInitierDelegation, createManagerDelegation, saveDelegationHandler } =
  useDelegationWork()
const opened = ref(false)
const emit = defineEmits<{
  (e: 'close'): void
}>()
async function handleOk() {
  for await (const toId of toIds.value) {
    await saveDelegationHandler({ ...editableDelegation.value, toId })
    toIds.value = []
  }
  closeHandler(false)
}

function closeHandler(e: boolean) {
  opened.value = e
  emit('close')
}
const userHandbook = computed(() =>
  users.value.map((user) => ({ value: user.id, label: user.lastName }))
)
const editableDelegation = ref<Delegation>({
  id: 0,
  from: null,
  fromId: '',
  to: null,
  toId: '',
  document: null,
  documentId: 0,
  description: '',
  date: '',
  parent: null,
  parentId: null,
  childs: [],
  isReaded: false,
  updated: '',
  created: '',
  isAprooved: false,
  isNeedAprooving: false,
  isActive: true,
  comments: []
})

function createNewDelegation(
  type: 'manager' | 'initier' | 'any',
  documentItem: DocumentItem,
  delegationId?: number
) {
  opened.value = true
  if (type === 'manager') {
    editableDelegation.value = createManagerDelegation({
      document: documentItem,
      delegationId: delegationId
    })
    toIds.value.push(editableDelegation.value.toId)
  }
  if (type === 'initier') {
    editableDelegation.value = createInitierDelegation({ document: documentItem, delegationId })
    toIds.value.push(editableDelegation.value.toId)
  }
  if (type === 'any') {
    editableDelegation.value = initDelegation({ document: documentItem, delegationId })
  }
}
function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}

const validFields = computed<{ [key in keyof Partial<Delegation>]: boolean }>(() => ({
  toId: toIds.value.length > 0,
  date: isNotNull(editableDelegation.value.date)
}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<Delegation>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<Delegation>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<Delegation>)[]).some(
    (key) => validFields.value[key] === false
  )
)

defineExpose({
  createNewDelegation
})
</script>
