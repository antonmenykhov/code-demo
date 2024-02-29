<template>
  <Modal
    title="Создать комментарий"
    :open="opened"
    @ok="handleOk"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="700px"
    :ok-button-props="{ disabled: isInValidForm }"
  >
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <FormItem label="Комментарий" :validate-status="fieldStatuses.comment">
        <Textarea auto-size v-model:value="comment" />
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts" setup>
import useDelegationCommentWork from '@/composables/useDelegationCommentWork.composable'
import type { DelegationComment } from '@/interfaces/delegation-comment.interface'
import { Modal, Form, FormItem, Textarea } from 'ant-design-vue'
import { computed, ref } from 'vue'

const { saveComment } = useDelegationCommentWork()
const opened = ref(false)
const emit = defineEmits<{
  (e: 'close'): void
}>()
async function handleOk() {
  await saveComment(delegationId.value, comment.value, isReturning.value)
  closeHandler(false)
}

function closeHandler(e: boolean) {
  emit('close')
  opened.value = e
}
const comment = ref('')
const delegationId = ref(0)
const isReturning = ref(false)

function initComment(newDelegationId: number, newIsReturning: boolean) {
  opened.value = true
  delegationId.value = newDelegationId
  isReturning.value = newIsReturning
}

function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}

const validFields = computed<{ [key in keyof Partial<DelegationComment>]: boolean }>(() => ({}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<DelegationComment>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<DelegationComment>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<DelegationComment>)[]).some(
    (key) => validFields.value[key] === false
  )
)

defineExpose({ initComment })
</script>
