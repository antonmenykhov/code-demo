<template>
  <div class="container input-form">
    <CardBlock block-name="Кто">
      <LabeledInput label="Наименование блока">
        <SelectBox
          :value="formData.blockName"
          :options="blockList"
          allow-search
          placeholder="Укажите блок"
          :invalid="validateMessageBlock.length > 0"
          :invalid-text="validateMessageBlock"
          @update:value="setBlock"
        />
      </LabeledInput>
      <LabeledInput label="Наименование СП">
        <SelectBox
          :value="formData.departmentName"
          :options="departmentList"
          allow-search
          placeholder="Укажите СП"
          :disabled="formData.blockName === ''"
          :invalid="validateMessageDepartment.length > 0"
          :invalid-text="validateMessageDepartment"
          @update:value="setDeparment"
        />
      </LabeledInput>
      <LabeledInput v-show="subDepartmentList.length > 1" label="Наименование СП ШР">
        <SelectBox
          v-model:value="formData.finStructureId"
          :options="subDepartmentList"
          value-expr="id"
          display-expr="department_name_sr"
          allow-search
          placeholder="Укажите СП ШР"
          :disabled="formData.blockName === ''"
          :invalid="validateMessageSubDepartment.length > 0"
          :invalid-text="validateMessageSubDepartment"
        />
      </LabeledInput>
      <LabeledInput label="МВЗ">
        <SelectBox
          v-model:value="formData.finStructureId"
          :options="mvzList"
          display-expr="computedValue"
          value-expr="id"
          allow-search
          :disabled="true"
          placeholder="Укажите МВЗ"
          :invalid="validateMessageMvz.length > 0"
          v-bind:invalid-text="validateMessageMvz"
        />
      </LabeledInput>
    </CardBlock>
    <CardBlock block-name="Куда">
      <LabeledInput label="Город">
        <SelectBox
          v-model:value="formData.cityId"
          :options="handbookStore.handbooks.cities"
          display-expr="name"
          value-expr="id"
          allow-search
          :invalid="validateMessageCity.length > 0"
          :invalid-text="validateMessageCity"
        />
      </LabeledInput>
      <LabeledInput label="Цель командировки">
        <SelectBox
          v-model:value="formData.tripPurposeId"
          :options="tripPurposeList"
          display-expr="trip_goal.goal_name"
          value-expr="id"
          allow-search
          :invalid="validateMessagePagePurpouse.length > 0"
          :invalid-text="validateMessagePagePurpouse"
        />
      </LabeledInput>
      <div class="card-row">
        <div class="card-column">
          <LabeledInput label="Грейд командируемых">
            <SelectBox
              v-model:value="formData.gradeId"
              :options="handbookStore.handbooks.grades"
              display-expr="name"
              value-expr="id"
              allow-search
            />
          </LabeledInput>
          <LabeledInput label="Дата начала">
            <DatePicker
              :max-value="formData.dateFinish || '2024-12-31T00:00:00.000Z'"
              v-model:value="formData.dateStart"
              :invalid="validateMessageDateStart.length > 0"
              :invalid-text="validateMessageDateStart"
              min-value="2023-12-31T19:00:00.000Z"
            />
          </LabeledInput>
          <LabeledInput label="Суточные на 1-го сотрудника">
            <NumberInput :value="computedDailyPaymentPrice" disabled />
          </LabeledInput>
        </div>
        <div class="card-column">
          <LabeledInput label="Количество командируемых">
            <NumberInput :value="formData.peopleCount" @update:value="setPeopleCount" />
          </LabeledInput>
          <LabeledInput label="Дата окончания">
            <DatePicker
              :min-value="formData.dateStart"
              v-model:value="formData.dateFinish"
              :invalid="validateMessageDateFinish.length > 0"
              :invalid-text="validateMessageDateFinish"
              max-value="2024-12-31T00:00:00.000Z"
            />
          </LabeledInput>
          <LabeledInput label="Продолжительность командировки, с дорогой">
            <NumberInput :value="computedTripDuration" disabled />
          </LabeledInput>
        </div>
      </div>
    </CardBlock>
    <CardBlock block-name="Где">
      <div class="card-row">
        <div class="card-column">
          <div class="block-header">Проживание в гостинице</div>
          <LabeledInput label="Кол-во ночей">
            <NumberInput
              v-model:value="computedHotelDuration"
              :show-clear-button="formData.hotelDuration !== null && formData.hotelDuration !== 0"
            />
          </LabeledInput>
          <LabeledInput label="Цена за 1 ночь">
            <NumberInput
              v-model:value="computedHotelPrice"
              :show-clear-button="formData.hotelPrice !== null && formData.hotelPrice !== 0"
            />
          </LabeledInput>
          <LabeledInput label="Всего проживание">
            <NumberInput :value="computedHotelTotal" disabled />
          </LabeledInput>
        </div>
        <div class="card-column">
          <div class="block-header">Проживание на территории заказчика</div>
          <LabeledInput label="Кол-во ночей">
            <NumberInput
              v-model:value="formData.customerSiteDuration"
              :show-clear-button="
                formData.customerSiteDuration !== null && formData.customerSiteDuration !== 0
              "
            />
          </LabeledInput>
          <LabeledInput label="Цена за 1 ночь">
            <NumberInput
              v-model:value="formData.customerSitePrice"
              :show-clear-button="
                formData.customerSitePrice !== null && formData.customerSitePrice !== 0
              "
            />
          </LabeledInput>
          <LabeledInput label="Всего проживание">
            <NumberInput :value="computedCustomerSiteTotal" disabled />
          </LabeledInput>
        </div>
      </div>
    </CardBlock>
    <CardBlock block-name="Как">
      <div class="block-header">Выбор вида транспорта, цена билета (туда/обратно)</div>
      <div class="card-row">
        <div class="card-column">
          <LabeledInput
            v-for="transport in formData.transport.slice(0, 2)"
            :key="transport.transportName"
            :label="transport.transportName"
          >
            <NumberInput
              :value="transport.price || computedTransportPrices[transport.calcedPrice]"
              :disabled="!transport.used"
              :invalid="validateMessageHasTransport.length > 0"
              :invalid-text="validateMessageHasTransport"
              css-class="transport-input"
              :show-clear-button="transport.price !== null && transport.price !== 0"
              @update:value="(newValue) => (transport.price = newValue)"
            >
              <template #prefix><Checkbox v-model:value="transport.used" /></template>
            </NumberInput>
          </LabeledInput>
        </div>
        <div class="card-column">
          <LabeledInput
            v-for="transport in formData.transport.slice(2)"
            :key="transport.transportName"
            :label="transport.transportName"
          >
            <NumberInput
              v-model:value="transport.price"
              :disabled="!transport.used"
              :invalid="validateMessageHasTransport.length > 0"
              :invalid-text="validateMessageHasTransport"
              css-class="transport-input"
            >
              <template #prefix><Checkbox v-model:value="transport.used" /></template>
            </NumberInput>
          </LabeledInput>
        </div>
      </div>
    </CardBlock>
    <LabeledInput label="Комментарий" style="margin-left: 66px">
      <TextAreaInput v-model:value="formData.comment" :show-counter="false" :rows="2" />
    </LabeledInput>
    <div class="buttons">
      <ButtonComponent
        reverse
        type="success"
        text="Сохранить"
        icon-class="fa-solid fa-save"
        :disabled="saveDisabled"
        @click="save"
      />
      <ButtonComponent
        reverse
        type="danger"
        text="Закрыть"
        icon-class="fa-solid fa-close"
        @click="goToList"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ButtonComponent,
  Checkbox,
  DatePicker,
  NumberInput,
  SelectBox,
  TextAreaInput,
  confirm
} from '@tnnc/tnnc-ui-kit'
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { handbooksStore } from '@/store/hanbooks.store'
import useTripCardValidation from './useTripCardValidation'
import useTripCardComputedHandbooks from './useTripCardComputedHandbooks'
import useTripCardFormComputedValues from './useTripCardFormComputedValues'
import { useDebounceFn } from '@vueuse/core'
import useTripCardInOut from './useTripCardInOut'
import useUserStatus from '@/composables/use-user-status.composable'
import LabeledInput from '@/components/LabeledInput.vue'
import CardBlock from '@/components/CardBlock.vue'

const { checkStatusForCard } = useUserStatus()
checkStatusForCard()
const handbookStore = handbooksStore()
const hasChanges = ref(false)
const router = useRouter()
function clearHasChanges() {
  setTimeout(() => {
    hasChanges.value = false
  }, 1)
}

const saveDisabled = computed(() => !hasChanges.value || hasValidationIssuses.value)

function goToList() {
  router.push({ path: '/' })
}

const { formData, initData, save } = useTripCardInOut(clearHasChanges, hasChanges, goToList)
watch(
  formData,
  () => {
    hasChanges.value = true
  },
  { deep: true }
)

const {
  computedDailyPaymentPrice,
  computedHotelDuration,
  computedHotelPrice,
  computedTransportPrices,
  computedCustomerSiteTotal,
  computedTripDuration,
  computedHotelTotal
} = useTripCardFormComputedValues(formData)

const {
  validateMessageBlock,
  validateMessageCity,
  validateMessageDateFinish,
  validateMessageDateStart,
  validateMessageDepartment,
  validateMessageHasTransport,
  validateMessageMvz,
  validateMessagePagePurpouse,
  validateMessageSubDepartment,
  hasValidationIssuses
} = useTripCardValidation(formData)

const {
  blockList,
  departmentList,
  subDepartmentList,
  mvzList,
  setBlock,
  setDeparment,
  tripPurposeList
} = useTripCardComputedHandbooks(formData)

initData(subDepartmentList)

const setPeopleCount = useDebounceFn((newValue: number | null) => {
  if (newValue && newValue >= 9) {
    return confirm(`Подтвердите ввод значения "Количество командируемых" равное ${newValue}`)
      .then(() => {
        formData.value.peopleCount = newValue
      })
      .catch(() => {
        const oldValue = formData.value.peopleCount
        formData.value.peopleCount = newValue
        nextTick(() => {
          formData.value.peopleCount = oldValue
        })
      })
  } else {
    formData.value.peopleCount = newValue || 0
  }
}, 300)
</script>
<style lang="scss">
.card-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  .card-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: flex-start;
  }
}
.container.input-form .transport-input {
  .tnnc-check-box {
    margin-left: 2px;
  }
  .tnnc-check-box input[type='checkbox']:checked {
    border-width: 1px;
  }
  .tnnc-input-wrapper {
    input {
      padding-left: 40px !important;
    }
  }
}
.block-header {
  margin-bottom: 5px;
  text-align: center;
}
</style>
