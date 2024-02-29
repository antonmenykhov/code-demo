<template>
  <CollapsableBlock
    :collapsed="collapsed"
    title="Основные атрибуты"
    @update:collapsed="
      (value) => {
        emit('update:collapsed', value)
      }
    "
  >
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Статус"
        :handbook="handbooks.statusCalendarPlan"
        field="statusCalendarPlan_None"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="Комментарий к статусу"
        :handbook="commentsForStatusHandbook"
        field="status_CommentBlock"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
    </div>
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Контрагент"
        :handbook="handbooks.organization"
        field="customer_Staff_Project"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="Тех. заказчик"
        :handbook="handbooks.organization"
        field="techCustomer_Staff_Project"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
    </div>
    <div class="row">
      <CardDatePicker
        field="dateConclusionContractPlan_CalendarPlan"
        label="Дата заключения(План)"
        :choosed-row="choosedRow"
        css-class="standart-width "
      />
      <CardDatePicker
        field="dateConclusionContractFact_CalendarPlan"
        label="Дата заключения(Факт)"
        :choosed-row="choosedRow"
        css-class="standart-width "
      />
    </div>
    <div class="row">
      <CardDatePicker
        field="start_CalendarPlan"
        label="Дата начала работ"
        :choosed-row="choosedRow"
        css-class="standart-width "
      />
      <CardDatePicker
        field="finish_CalendarPlan"
        label="Дата окончания работ"
        :choosed-row="choosedRow"
        css-class="standart-width "
      />
    </div>
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Вид работ"
        :handbook="handbooks.kindWork"
        field="kindWork_Business_Project"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="Направление работ"
        :handbook="filteredDirectWorkHandbook"
        field="directWork_Business_Project"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
    </div>
    <div class="row">
      <CardNumberInput
        field="totalContract_CalendarPlan"
        label="Всего по договору"
        css-class="standart-width "
        :choosed-row="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="OPEX/CAPEX"
        :handbook="handbooks.capex"
        field="opex_CalendarPlan"
        value-expr="id"
        display-expr="name"
        :choosed-row="choosedRow"
      />
    </div>
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Риск"
        :handbook="handbooks.yesNo"
        field="risk_CalendarPlan"
        value-expr="id"
        display-expr="name"
        :choosed-row="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="НДС"
        :handbook="handbooks.nds"
        field="nds_None"
        value-expr="name"
        display-expr="textName"
        :choosed-row="choosedRow"
      />
    </div>
  </CollapsableBlock>
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import CardDatePicker from './CardDatePicker.vue'
import CardNumberInput from './CardNumberInput.vue'
import CardSelectBox from './CardSelectBox.vue'
import CollapsableBlock from './CollapsableBlock.vue'
import { computed } from 'vue'

const { handbooks } = storeToRefs(useHandbookStore())
const props = defineProps<{
  choosedRow: TprStandart
  collapsed: boolean
}>()

const commentsForStatusHandbook = computed(() =>
  handbooks.value.commentStatusCalendarPlan.filter(
    (comment) =>
      comment.statusCalendarPlanId === props.choosedRow.statusCalendarPlanId_CalendarPlan ||
      comment.statusCalendarPlanId ===
        props.choosedRow['statusCalendarPlan_NoneId' as keyof TprStandart]
  )
)
const emit = defineEmits<{
  (e: 'update:collapsed', data: boolean): void
}>()

const filteredDirectWorkHandbook = computed(() => {
  const kindwork = handbooks.value.kindWork.find(
    (kindwork) => kindwork.name === props.choosedRow.kindWork_Business_Project
  )
  const variants = handbooks.value.directWork.filter(
    (directwork) => directwork.kindWorkId === kindwork?.id
  )
  return variants.length > 0 ? variants : handbooks.value.directWork
})
</script>

<style lang="scss"></style>
