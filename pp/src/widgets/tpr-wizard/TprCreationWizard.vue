<template>
  <div class="tpr-creation-wizard">
    <ButtonComponent
      :text="`Добавить ${isSub ? 'субподряд' : ''}`"
      @click="startWizard"
      :disabled="editable === false"
    />
    <PopupComponent
      v-model:visible="isPopupVisible"
      :title="`Добавить ${partialTpr.genwork_CalendarPlan ? 'ген' : 'суб'}подряд`"
      :height="partialTpr.genwork_CalendarPlan ? '550px' : '610px'"
      @update:visible="flushData"
    >
      <div class="tpr-creation-wizard" v-if="isContentVisible">
        <div class="row">
          <NumberContractAutocomplete
            label="Номер договора"
            v-model:value="partialTpr.numberContract_None"
            @emit-valid-stage="setValidContractNumber"
          />
          <ButtonComponent
            text="Получить инфо из СУДа"
            :disabled="!isValidContractNumber"
            @click="setInfoFromSud"
          />
        </div>
        <div class="row">
          <TextInput
            v-model:value="partialTpr.name_CalendarPlan"
            label="Наименование договора"
            :invalid="isNull(partialTpr.name_CalendarPlan)"
            invalid-text="Обязательное поле!"
          />
        </div>
        <div class="row">
          <SelectBox
            :options="availableDepartments"
            v-model:value="partialTpr.departmentId_Staff_Project"
            display-expr="name"
            value-expr="id"
            label="Управление"
            :invalid="isNull(partialTpr.departmentId_Staff_Project)"
            invalid-text="Обязательное поле!"
            :disabled="!partialTpr.genwork_CalendarPlan"
          />
        </div>
        <div class="row">
          <DatePicker
            :max-value="maxDateForStart"
            :min-value="minDateForStart"
            v-model:value="partialTpr.start_CalendarPlan"
            label="Дата начала"
            :invalid="isNull(partialTpr.start_CalendarPlan)"
            invalid-text="Обязательное поле!"
          />
          <DatePicker
            :min-value="minDateForFinish"
            :max-value="maxDateForFinish"
            v-model:value="partialTpr.finish_CalendarPlan"
            label="Дата окончания"
            :invalid="isNull(partialTpr.finish_CalendarPlan)"
            invalid-text="Обязательное поле!"
          />
        </div>
        <div class="row">
          <SelectBox
            :options="handbooks.kindWork"
            v-model:value="partialTpr.kindWorkId_Business_Project"
            display-expr="name"
            value-expr="id"
            label="Вид работ"
            allow-search
            :invalid="isNull(partialTpr.kindWorkId_Business_Project)"
            invalid-text="Обязательное поле!"
            @update:value="() => (partialTpr.directWorkId_Business_Project = null)"
            :disabled="!partialTpr.genwork_CalendarPlan"
          />
          <SelectBox
            :options="filteredDirectWorkHandbook"
            v-model:value="partialTpr.directWorkId_Business_Project"
            display-expr="name"
            value-expr="id"
            label="Направление работ"
            allow-search
            :invalid="isNull(partialTpr.directWorkId_Business_Project)"
            invalid-text="Обязательное поле!"
            :disabled="!partialTpr.genwork_CalendarPlan"
          />
        </div>
        <div class="row">
          <SelectBox
            :options="handbooks.organization"
            v-model:value="partialTpr.customerId_Staff_Project"
            display-expr="name"
            value-expr="id"
            label="Контрагент"
            allow-search
            :invalid="isNull(partialTpr.customerId_Staff_Project)"
            invalid-text="Обязательное поле!"
          />
          <SelectBox
            :options="handbooks.statusCalendarPlan"
            v-model:value="partialTpr.statusCalendarPlanId_CalendarPlan"
            display-expr="name"
            value-expr="id"
            label="Статус"
            allow-search
            :invalid="isNull(partialTpr.statusCalendarPlanId_CalendarPlan)"
            invalid-text="Обязательное поле!"
          />
        </div>
        <div class="row">
          <SelectBox
            :options="handbooks.yesNo"
            v-model:value="partialTpr.risk_CalendarPlan"
            display-expr="name"
            value-expr="id"
            label="Риск"
            :invalid="isNull(partialTpr.risk_CalendarPlan)"
            invalid-text="Обязательное поле!"
          />
          <SelectBox
            :options="handbooks.capex"
            v-model:value="partialTpr.opex_CalendarPlan"
            display-expr="name"
            value-expr="id"
            label="CAPEX/OPEX"
            :invalid="isNull(partialTpr.opex_CalendarPlan)"
            invalid-text="Обязательное поле!"
            :disabled="!partialTpr.genwork_CalendarPlan"
          />
        </div>

        <div class="row" v-if="!partialTpr.genwork_CalendarPlan">
          <SelectBox
            :options="handbooks.scopeWorkSubcontract"
            v-model:value="partialTpr.scopeWorkSubcontractId_GhostCalendarPlan"
            display-expr="name"
            value-expr="id"
            label="Объем передачи на субподряд"
            :invalid="
              isNull(partialTpr.scopeWorkSubcontractId_GhostCalendarPlan) &&
              !partialTpr.genwork_CalendarPlan
            "
            invalid-text="Обязательное поле!"
          />
          <SelectBox
            :options="handbooks.reasonWorkSubcontract"
            v-model:value="partialTpr.reasonWorkSubcontractId_GhostCalendarPlan"
            display-expr="name"
            value-expr="id"
            label="Причина передачи на субподряд"
            :invalid="
              isNull(partialTpr.reasonWorkSubcontractId_GhostCalendarPlan) &&
              !partialTpr.genwork_CalendarPlan
            "
            invalid-text="Обязательное поле!"
          />
        </div>
        <div class="row" style="margin-top: 7px">
          <ButtonComponent text="Добавить" :disabled="!canSave" @click="createTpr" />
        </div>
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import type { Department } from '@/interfaces/supp-entities/department.interface'
import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import {
  ButtonComponent,
  DatePicker,
  PopupComponent,
  SelectBox,
  TextInput,
  notify
} from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import NumberContractAutocomplete from '@/components/general/NumberContractAutocomplete.vue'
import type { Contract } from '@/interfaces/contracts-entities/contract.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import useContractsStagesHttp from '@/composables/http/use-contracts-stages-http.composable'

const isPopupVisible = ref(false)
const isContentVisible = ref(false)
const { handbooks } = storeToRefs(useHandbookStore())
const props = defineProps<{
  year: number
  availableDepartments: Department[]
  isSub?: boolean
  genTpr?: TprStandart
  editable?: boolean
}>()
const emit = defineEmits<{
  (e: 'saveTpr', tpr: Partial<TprStandart>): void
}>()
const partialTpr = ref<{
  customerId_Staff_Project: null | number
  name_CalendarPlan: null | string
  start_CalendarPlan: null | string
  finish_CalendarPlan: null | string
  statusCalendarPlanId_CalendarPlan: null | number
  departmentId_Staff_Project: null | number
  kindWorkId_Business_Project: null | number
  directWorkId_Business_Project: null | number
  risk_CalendarPlan: boolean
  opex_CalendarPlan: boolean
  genwork_CalendarPlan: boolean
  numberContract_None: string
  scopeWorkSubcontractId_GhostCalendarPlan: null | number
  reasonWorkSubcontractId_GhostCalendarPlan: null | number
  parentId_CalendarPlan: null | number
  numberContractId_CalendarPlan: null
}>({
  name_CalendarPlan: null,
  start_CalendarPlan: null,
  finish_CalendarPlan: null,
  risk_CalendarPlan: false,
  opex_CalendarPlan: true,
  genwork_CalendarPlan: true,
  numberContract_None: '',
  parentId_CalendarPlan: null,
  scopeWorkSubcontractId_GhostCalendarPlan: null,
  reasonWorkSubcontractId_GhostCalendarPlan: null,
  statusCalendarPlanId_CalendarPlan: null,
  departmentId_Staff_Project: null,
  kindWorkId_Business_Project: null,
  directWorkId_Business_Project: null,
  customerId_Staff_Project: null,
  numberContractId_CalendarPlan: null
})

const isValidContractNumber = ref(false)
function setValidContractNumber(newVal: boolean) {
  isValidContractNumber.value = newVal
}
const filteredDirectWorkHandbook = computed(() => {
  const variants = handbooks.value.directWork.filter(
    (directwork) => directwork.kindWorkId === partialTpr.value.kindWorkId_Business_Project
  )
  return variants.length > 0 ? variants : handbooks.value.directWork
})

const requiredForAll: (keyof typeof partialTpr.value)[] = [
  'customerId_Staff_Project',
  'name_CalendarPlan',
  'start_CalendarPlan',
  'finish_CalendarPlan',
  'statusCalendarPlanId_CalendarPlan',
  'departmentId_Staff_Project',
  'kindWorkId_Business_Project',
  'directWorkId_Business_Project',
  'risk_CalendarPlan',
  'opex_CalendarPlan',
  'genwork_CalendarPlan'
]
const requiredForSub: (keyof typeof partialTpr.value)[] = [
  'scopeWorkSubcontractId_GhostCalendarPlan',
  'reasonWorkSubcontractId_GhostCalendarPlan',
  'parentId_CalendarPlan'
]
const canSave = computed(() => {
  if (
    partialTpr.value.genwork_CalendarPlan &&
    requiredForAll.every((key) => partialTpr.value[key] !== null)
  )
    return true
  if (
    !partialTpr.value.genwork_CalendarPlan &&
    [...requiredForAll, ...requiredForSub].every((key) => partialTpr.value[key] !== null)
  )
    return true
  return false
})
const maxDateForStart = computed(() => {
  if (partialTpr.value.finish_CalendarPlan) return partialTpr.value.finish_CalendarPlan
  return undefined
})
const minDateForStart = computed(() => {
  if (props.genTpr) return props.genTpr.start_CalendarPlan
  return undefined
})
const minDateForFinish = computed(() => {
  if (partialTpr.value.start_CalendarPlan) return partialTpr.value.start_CalendarPlan
  return undefined
})
const maxDateForFinish = computed(() => {
  if (props.genTpr) return props.genTpr.finish_CalendarPlan
  return undefined
})
function isNull(value: number | string | boolean | null) {
  if (value === '' || value === null || value === 0) return true
  return false
}

const { getContractByContractNumber } = useContractsStagesHttp()
async function setInfoFromSud() {
  getContractByContractNumber(partialTpr.value.numberContract_None).then(({ data }) => {
    let contract: Contract | null = null
    if (data.length === 1) {
      contract = data[0]
    }
    if (data.length > 1) {
      contract = data.reduce((acc, contract) => {
        acc = acc.price < contract.price ? contract : acc
        return acc
      }, data[0])
    }
    if (contract)
      partialTpr.value = {
        ...partialTpr.value,
        name_CalendarPlan: contract.name,
        start_CalendarPlan: contract.start,
        finish_CalendarPlan: contract.finish
      }
  })
}

function startWizard() {
  isPopupVisible.value = true
  setInitialData()
  setTimeout(() => {
    isContentVisible.value = true
  }, 300)
}

function setInitialData() {
  if (props.availableDepartments.length === 1) {
    partialTpr.value.departmentId_Staff_Project = props.availableDepartments[0].id
  }
  if (props.isSub) {
    partialTpr.value.genwork_CalendarPlan = false
    if (props.genTpr) {
      partialTpr.value = {
        ...partialTpr.value,
        parentId_CalendarPlan: props.genTpr.ID,
        opex_CalendarPlan: props.genTpr.opex_CalendarPlan,
        departmentId_Staff_Project:
          handbooks.value.department.find(
            (dep) => dep.name === props.genTpr?.department_Staff_Project
          )?.id || null,
        directWorkId_Business_Project:
          handbooks.value.directWork.find(
            (dep) => dep.name === props.genTpr?.directWork_Business_Project
          )?.id || null,
        kindWorkId_Business_Project:
          handbooks.value.kindWork.find(
            (dep) => dep.name === props.genTpr?.kindWork_Business_Project
          )?.id || null
      }
    } else {
      throw 'Для суба нужен ген! Заполни getTpr'
    }
  }
}
function flushData() {
  partialTpr.value = {
    name_CalendarPlan: null,
    start_CalendarPlan: null,
    finish_CalendarPlan: null,
    risk_CalendarPlan: false,
    opex_CalendarPlan: true,
    genwork_CalendarPlan: true,
    numberContract_None: '',
    parentId_CalendarPlan: null,
    scopeWorkSubcontractId_GhostCalendarPlan: null,
    reasonWorkSubcontractId_GhostCalendarPlan: null,
    statusCalendarPlanId_CalendarPlan: null,
    departmentId_Staff_Project: null,
    kindWorkId_Business_Project: null,
    directWorkId_Business_Project: null,
    customerId_Staff_Project: null,
    numberContractId_CalendarPlan: null
  }
}
function createTpr() {
  emit('saveTpr', partialTpr.value as any)
  const startYear = new Date(partialTpr.value.start_CalendarPlan as string).getFullYear()
  const finishYear = new Date(partialTpr.value.finish_CalendarPlan as string).getFullYear()
  if (startYear > props.year || finishYear < props.year)
    notify(
      `ТПР не будет показан в теущем году, смотрите в ${startYear}-${finishYear}гг`,
      'danger',
      7000
    )
  flushData()
  isPopupVisible.value = false
  isContentVisible.value = false
}
</script>
<style lang="scss">
.tpr-creation-wizard {
  .row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    & > * {
      flex: 1;
    }
  }
}
</style>
