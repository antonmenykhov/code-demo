<template>
  <Modal
    :title="title"
    :open="opened"
    :confirm-loading="loading"
    @ok="handleOk"
    ok-text="Сохранить"
    @update:open="closeHandler"
    width="1000px"
    :ok-button-props="{ disabled: isInValidForm }"
  >
    <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <FormItem label="Название организации" :validate-status="fieldStatuses.name">
        <Input v-model:value="editableContractor.name" />
      </FormItem>
      <FormItem label="Короткое название организации">
        <Input v-model:value="editableContractor.shortName" />
      </FormItem>
      <FormItem label="Реквизиты организации" :validate-status="fieldStatuses.reqisits">
        <Textarea auto-size v-model:value="editableContractor.reqisits" />
      </FormItem>
      <FormItem label="Адрес организации" :validate-status="fieldStatuses.address">
        <Textarea auto-size v-model:value="editableContractor.address" />
      </FormItem>
      <FormItem label="Адрес электронной почты" :validate-status="fieldStatuses.email">
        <Input v-model:value="editableContractor.email" />
      </FormItem>
      <FormItem label="Директоры">
        <table class="form-table" :class="{ isMobile }">
          <tr>
            <th>Отображаемое имя</th>
            <th>Должность в дательном падеже</th>
            <th>ФИО в дательном падеже</th>
            <th></th>
          </tr>
          <tr v-for="(director, index) in editableContractor.directors" :key="index">
            <td>
              <Textarea
                auto-size
                placeholder="Введите ФИО и должность"
                class=""
                v-model:value="director.name"
              />
            </td>
            <td>
              <Textarea
                auto-size
                placeholder="Должность в дательном падеже"
                class=""
                v-model:value="director.formStaffName"
              />
            </td>
            <td>
              <Textarea
                auto-size
                placeholder="ФИО в дательном падеже"
                class=""
                v-model:value="director.formFullName"
              />
            </td>
            <td>
              <Button
                @click="deleteDirector(index)"
                :disabled="editableContractor.directors.length === 1"
                :danger="fieldStatuses.directors === 'error'"
              >
                <MinusCircleOutlined />
              </Button>
            </td>
          </tr>
        </table>

        <Button block @click="addDirector">Добавить директора</Button>
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts" setup>
import type { Contractor } from '@/interfaces/contractor.interface'
import { Modal, Input, Form, FormItem, Textarea, Button } from 'ant-design-vue'
import { computed, ref, watch } from 'vue'
import { MinusCircleOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useModeStore } from '@/stores/modeStore'

const { isMobile } = storeToRefs(useModeStore())
const props = defineProps<{
  opened: boolean
  loading: boolean
  title: string
  contractor: Contractor
}>()
const emit = defineEmits<{
  (e: 'save', changedContractor: Contractor): void
  (e: 'update:opened', data: boolean): void
}>()
function handleOk() {
  emit('save', editableContractor.value)
}
const openedComputed = computed(() => props.contractor)
watch(openedComputed, (newVal) => {
  if (newVal) {
    editableContractor.value = JSON.parse(JSON.stringify(props.contractor))
  }
})
const editableContractor = ref<Contractor>(JSON.parse(JSON.stringify(props.contractor)))
function closeHandler(e: boolean) {
  editableContractor.value = JSON.parse(JSON.stringify(props.contractor))
  emit('update:opened', e)
}
function isNotNull(value: string | null | number) {
  return value !== null && value !== 0 && value !== '' && value !== undefined
}
const validFields = computed<{ [key in keyof Partial<Contractor>]: boolean }>(() => ({
  name: isNotNull(editableContractor.value.name)
}))
const fieldStatuses = computed(() => {
  const statuses: { [key in keyof Partial<Contractor>]: 'error' | '' } = {}
  ;(Object.keys(validFields.value) as (keyof Partial<Contractor>)[]).forEach((key) => {
    statuses[key] = validFields.value[key] === false ? 'error' : ''
  })
  return statuses
})
const isInValidForm = computed(() =>
  (Object.keys(validFields.value) as (keyof Partial<Contractor>)[]).some(
    (key) => validFields.value[key] === false
  )
)
function addDirector() {
  editableContractor.value.directors.push({
    id: 0,
    contractorId: editableContractor.value.id,
    name: '',
    formStaffName: '',
    formFullName: ''
  })
}
function deleteDirector(index: number) {
  editableContractor.value.directors.splice(index, 1)
}
</script>
