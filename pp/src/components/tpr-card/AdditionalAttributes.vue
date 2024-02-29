<template>
  <CollapsableBlock
    :collapsed="collapsed"
    @update:collapsed="
      (value) => {
        emit('update:collapsed', value)
      }
    "
    title="Дополнительные атрибуты"
  >
    <CardTextAreaInput
      field="deviationPlan_CommentBlock"
      label="Причина отклонения Прогноза от БП"
      css-class="text-area"
      :choosed-row="choosedRow"
    />
    <CardTextAreaInput
      field="deviationContract_CommentBlock"
      label="Причина отклонения Прогноза от КП"
      css-class="text-area"
      :choosed-row="choosedRow"
    />
    <div class="row">
      <CardTextInput
        field="rate_CommentBlock"
        label="Ставка"
        css-class="standart-width "
        :choosed-row="choosedRow"
      />
      <CardTextInput
        field="okved_None"
        label="ОКВЭД"
        css-class="standart-width "
        :choosed-row="choosedRow"
        disabled
      />
    </div>
    <CardTextAreaInput
      field="general_CommentBlock"
      label="Комментарий"
      css-class="text-area"
      :choosed-row="choosedRow"
    />
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Департамент Роснефти"
        :handbook="handbooks.departmentOrganization"
        field="techCustomerDepartment_Staff_Project"
        value-expr="fullName"
        display-expr="name"
        :choosedRow="choosedRow"
      />
      <CardTextInput
        field="internalOrder_CalendarPlan"
        label="Номер заказа"
        css-class="standart-width "
        :choosed-row="choosedRow"
        disabled
      />
    </div>
    <div class="row">
      <CardDatePicker
        field="timeConstraints_GhostCalendarPlan"
        label="Срок окончания работ"
        :choosed-row="choosedRow"
        css-class="standart-width "
      />
      <CardSelectBox
        css-class="standart-width "
        label="Мониторинг внеплановых объемов"
        :handbook="handbooks.months"
        field="monitoringUnplannedWork_GhostCalendarPlan"
        value-expr="id"
        display-expr="name"
        :choosedRow="choosedRow"
      />
    </div>
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Формат закл. ген. договора"
        :handbook="handbooks.formatGeneralContract"
        field="formatGeneralContractOutsideCustomer_None"
        value-expr="name"
        display-expr="name"
        :choosedRow="choosedRow"
      />
      <CardNumberInput
        field="cIP_GhostCalendarPlan"
        label="ЦИП"
        :choosed-row="choosedRow"
        css-class="standart-width "
      />
    </div>
    <div class="row">
      <CardSelectBox
        css-class="standart-width "
        label="Объем раб. пер. на суб."
        :handbook="handbooks.scopeWorkSubcontract"
        :field="'scopeWorkSubcontract_None'"
        value-expr="name"
        display-expr="name"
        :choosedRow="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="Причина пер. на суб."
        :handbook="handbooks.reasonWorkSubcontract"
        :field="'reasonWorkSubcontract_None'"
        value-expr="name"
        display-expr="name"
        :choosedRow="choosedRow"
      />
    </div>
    <div class="row">
      <TextInput
        css-class="standart-width "
        label="УИН"
        disabled
        :value="`ТННЦ-${choosedRow.uniqueIdNumberOfYear_NumberCalendarPlanOfYear}`"
      />
      <TextInput
        css-class="standart-width "
        label="Сторона/Группа"
        disabled
        :value="choosedRow.outside_None ? 'Группа' : 'Сторона'"
      />
    </div>
    <CardTextAreaInput
      field="note_CommentBlock"
      label="Примечание"
      css-class="text-area"
      :choosed-row="choosedRow"
    />
  </CollapsableBlock>
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import CardDatePicker from './CardDatePicker.vue'
import CardNumberInput from './CardNumberInput.vue'
import CardSelectBox from './CardSelectBox.vue'
import CardTextAreaInput from './CardTextAreaInput.vue'
import CardTextInput from './CardTextInput.vue'
import CollapsableBlock from './CollapsableBlock.vue'
import { TextInput } from 'tnnc-ui-kit'

const { handbooks } = storeToRefs(useHandbookStore())
const props = defineProps<{
  choosedRow: TprStandart
  collapsed: boolean
}>()
const emit = defineEmits<{
  (e: 'update:collapsed', data: boolean): void
}>()
</script>
@/interfaces/supp-entities/tpr-standart.interface
