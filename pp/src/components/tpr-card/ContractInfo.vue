<template>
  <CollapsableBlock
    title="Информация о договоре"
    :collapsed="collapsed"
    @update:collapsed="
      (value) => {
        emit('update:collapsed', value)
      }
    "
  >
    <div class="row">
      <TextInput css-class="standart-width " :value="choosedRow.ID" label="№ п/п" disabled />
      <CardNumberContractAutocomplete
        css-class="standart-width "
        field="numberContract_None"
        label="Номер договора"
        :choosed-row="choosedRow"
      />
      <CardTextInput
        css-class="flex"
        field="name_CalendarPlan"
        label="Название договора"
        :choosed-row="choosedRow"
      />
      <CardSelectBox
        css-class="standart-width "
        label="Управление"
        :handbook="handbooks.department"
        field="department_Staff_Project"
        value-expr="name"
        display-expr="name"
        :choosed-row="choosedRow"
      />
    </div>
    <div class="row">
      <SelectBox
        allow-search
        css-class="standart-width "
        label="Генподряд"
        :options="handbooks.genwork"
        :value="choosedRow.genwork_CalendarPlan"
        value-expr="id"
        display-expr="name"
        disabled
      />
      <TextInput
        css-class="standart-width "
        :value="choosedRow.connection?.mainNumber || ''"
        label="Номер основного договора"
        disabled
        placeholder=""
      />
      <TextInput
        css-class="flex"
        :value="choosedRow.connection?.mainName || ''"
        label="Название основного договора"
        disabled
        placeholder=""
      />
      <TextInput
        placeholder=""
        :value="curatorName"
        label="Куратор"
        css-class="standart-width "
        disabled
      />
    </div>
  </CollapsableBlock>
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import { SelectBox, TextInput } from 'tnnc-ui-kit'
import { computed } from 'vue'
import CardNumberContractAutocomplete from './CardNumberContractAutocomplete.vue'
import CardSelectBox from './CardSelectBox.vue'
import CardTextInput from './CardTextInput.vue'
import CollapsableBlock from './CollapsableBlock.vue'

const { handbooks } = storeToRefs(useHandbookStore())
const props = defineProps<{
  choosedRow: TprStandart
  collapsed: boolean
}>()
const emit = defineEmits<{
  (e: 'update:collapsed', data: boolean): void
}>()
const curatorName = computed(
  () =>
    handbooks.value.curatorDepartment.find(
      (curator) =>
        curator.id ===
        handbooks.value.department.find(
          (department) => department.name === props.choosedRow.department_Staff_Project
        )?.curatorDepartmentId
    )?.name || ''
)
</script>
@/interfaces/supp-entities/tpr-standart.interface
