<template>
  <div class="tpr-card-indexes-block">
    <CollapsableBlock
      v-for="force in choosedForceTypesObjects"
      :key="force.name"
      :class="[force.cssClass]"
      :title="`Показатели ${force.caption}`"
      :collapsed="collapsedElements[force.name]"
      @update:collapsed="
        (value) => {
          setCollapsed(force.name, value)
        }
      "
    >
      <div class="row header">
        <TextInput disabled value="Показатели" />
        <TextInput
          v-show="choosedMonthsTotals.includes(month.id)"
          disabled
          v-for="month in monthHandbook"
          :key="month.id"
          :value="month.name"
        />
        <TextInput v-show="choosedMonthsTotals.includes('total')" disabled :value="'Всего'" />
        <TextInput
          v-show="choosedMonthsTotals.includes('growingTotal')"
          disabled
          :value="'Нар. итог'"
        />
      </div>
      <div
        class="row"
        v-for="index in choosedIndexTypesObjects"
        :key="index.name"
        v-show="!(force.name === 'own' && index.name === 'planCp_None')"
      >
        <TextInput :value="index.caption" disabled />
        <CardNumberInput
          v-show="choosedMonthsTotals.includes(month.id)"
          v-for="month in monthHandbook"
          :key="month.id"
          :disabled="candEditCell(force.name, index.name, month.id)"
          :field="(`${force.name}_mounth${month.id}_${index.name}` as keyof TprStandart)"
          :choosed-row="choosedRow"
        />
        <CardNumberInput
          v-show="choosedMonthsTotals.includes('total')"
          disabled
          :field="(`${force.name}E${index.name}` as keyof TprStandart)"
          :choosed-row="choosedRow"
        />
        <NumberInput
          v-show="choosedMonthsTotals.includes('growingTotal')"
          disabled
          :mask="maskitoNumberOptionsGenerator({ precision: 2 })"
          :value="calcGrowingTotal(force.name, index.name, growingRange)"
        />
      </div>
    </CollapsableBlock>
  </div>
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { monthHandbook } from '@/hooks/months'
import { NumberInput, TextInput } from 'tnnc-ui-kit'
import CollapsableBlock from './CollapsableBlock.vue'
import { computed } from 'vue'
import type { ForceType } from '@/composables/useTprIndexesTypes.composable'
import CardNumberInput from './CardNumberInput.vue'
import { keycloak } from '@/services/keycloack/plugin'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'

const props = defineProps<{
  choosedRow: TprStandart
  choosedForceTypesObjects: ForceType[]
  choosedIndexTypesObjects: { name: string; caption: string }[]
  growingRange: number[]
  collapsed_general: boolean
  collapsed_own: boolean
  collapsed_sub: boolean
  choosedMonthsTotals: (number | string)[]
  isSub: boolean
  openedPeriod: number[]
}>()

const collapsedElements = computed(() => ({
  general: props.collapsed_general,
  own: props.collapsed_own,
  sub: props.collapsed_sub
}))

const emit = defineEmits<{
  (e: 'update:collapsed_general', value: boolean): void
  (e: 'update:collapsed_own', value: boolean): void
  (e: 'update:collapsed_sub', value: boolean): void
}>()

function setCollapsed(forceName: 'general' | 'own' | 'sub', newValue: boolean) {
  // @ts-ignore
  emit(`update:collapsed_${forceName}`, newValue)
}

function calcGrowingTotal(forceName: string, indexName: string, growingRange: number[]) {
  let total = 0
  for (let i = growingRange[0]; i <= growingRange[1]; i++) {
    total +=
      (props.choosedRow[`${forceName}_mounth${i}_${indexName}` as keyof TprStandart] as number) || 0
  }
  return total
}

function candEditCell(forceName: string, indexName: string, monthNumber: number) {
  if (forceName === 'own') return true
  if (!['factPrice_Stage', 'price_Stage', 'correction_Stage'].includes(indexName)) return true
  if (
    (indexName.includes('factPrice') || indexName.includes('correction')) &&
    !(keycloak.hasResourceRole('admin', 'supp') || keycloak.hasResourceRole('economist', 'supp'))
  )
    return true
  if ((props.isSub && forceName !== 'sub') || (!props.isSub && forceName !== 'general')) return true
  if (monthNumber <= props.openedPeriod[0] || monthNumber > props.openedPeriod[1]) return true
  return false
}
</script>
<style lang="scss">
.tpr-card-indexes-block {
  .header {
    .tnnc-input-labeled input {
      font-weight: 500;
      color: var(--tnnc-add-color-gray-2);
    }
  }
}
</style>
