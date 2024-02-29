<template>
  <div class="container input-form limit-card">
    <table>
      <colgroup>
        <col style="width: 25%" />
        <col />
        <col style="width: 20%" />
      </colgroup>
      <tbody>
        <tr>
          <td>Наименование блока</td>
          <td>
            <SelectBox
              :value="formData.blockName"
              :options="blockList"
              allow-search
              placeholder="Укажите блок"
              :invalid="validateMessageBlock.length > 0"
              :invalid-text="validateMessageBlock"
              @update:value="setBlock"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Наименование СП</td>
          <td>
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
          </td>
          <td></td>
        </tr>
        <tr v-show="subDepartmentList.length > 1">
          <td>Наименование СП ШР</td>
          <td>
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
          </td>
          <td></td>
        </tr>
        <tr>
          <td>МВЗ</td>
          <td>
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
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Цель командировки</td>
          <td>
            <SelectBox
              v-model:value="formData.tripPurposeId"
              :options="tripPurposeList"
              display-expr="trip_goal.goal_name"
              value-expr="id"
              allow-search
              :invalid="validateMessagePagePurpouse.length > 0"
              :invalid-text="validateMessagePagePurpouse"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Сумма лимита, руб.</td>
          <td>
            <NumberInput
              v-model:value="formData.reserve"
              :invalid="validateMessageReserve.length > 0"
              :invalid-text="validateMessageReserve"
            />
          </td>
          <td></td>
        </tr>
        <tr class="comment-row">
          <td>Комментарий</td>
          <td colspan="2">
            <TextAreaInput v-model:value="formData.comment" :show-counter="false" :rows="3" />
          </td>
        </tr>
      </tbody>
    </table>
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
import { ButtonComponent, NumberInput, SelectBox, TextAreaInput } from '@tnnc/tnnc-ui-kit'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import useTripCardValidation from '../tripCard/useTripCardValidation'
import useTripCardComputedHandbooks from '../tripCard/useTripCardComputedHandbooks'
import useTripCardInOut from '../tripCard/useTripCardInOut'
import useUserStatus from '@/composables/use-user-status.composable'

const { checkStatusForCard } = useUserStatus()
checkStatusForCard()
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
  validateMessageBlock,
  validateMessageDepartment,
  validateMessageMvz,
  validateMessagePagePurpouse,
  validateMessageSubDepartment
} = useTripCardValidation(formData)

const validateMessageReserve = computed(() =>
  formData.value.reserve !== null && formData.value.reserve !== 0
    ? ''
    : 'Необходимо указать сумму лимита'
)

const hasValidationIssuses = computed(
  () =>
    validateMessageBlock.value.length > 0 ||
    validateMessageDepartment.value.length > 0 ||
    validateMessageMvz.value.length > 0 ||
    validateMessagePagePurpouse.value.length > 0 ||
    validateMessageSubDepartment.value.length > 0 ||
    validateMessageReserve.value.length > 0
)

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
</script>
<style lang="scss">
.limit-card {
  .buttons {
    padding-right: 29%;
  }
  table {
    td {
      border-bottom: 2px solid transparent;
    }
    td:first-child {
      text-align: right;
      padding-right: 10px;
    }

    td:last-child {
      text-align: center;
      padding-left: 10px;
    }

    .comment-row {
      td {
        border-top: 10px solid transparent;
      }
      td:last-child {
        padding-left: 0;
      }
      td:first-child {
        vertical-align: top;
      }
    }
  }
}
</style>
