<template>
  <SelectBox
    allow-search
    :css-class="`${cssClass} ${field} ${fieldsClasses[field]} card-input`"
    :label="label"
    :options="handbook"
    :value="choosedRow[field]"
    :value-expr="valueExpr"
    :display-expr="displayExpr"
    :invalid="allValidationErrors[field] !== undefined"
    :invalid-text="allValidationErrors[field]"
    :disabled="disabled || computedDisable"
    :data-field="field"
    show-clear-button
    @update:value="setHandbookValue"
  />
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { SelectBox } from 'tnnc-ui-kit'
import { inject, type ComputedRef, computed } from 'vue'
import type { TprCardValidationError } from '@/widgets/tpr-card/composables/useCardValidations.composable'

const props = defineProps<{
  handbook: any[]
  valueExpr: string
  displayExpr: string
  field: keyof TprStandart
  label?: string
  cssClass?: string
  choosedRow: TprStandart
  disabled?: boolean
}>()

function setHandbookValue(newVal: any) {
  setChange({ field: props.field, value: newVal })

  setChange({
    field: `${props.field}Id` as keyof TprStandart,
    value: props.handbook.find((item) => item[props.valueExpr] === newVal)?.id || 0
  })
}
const setChange = inject('setChange') as <
  K extends keyof TprStandart,
  T extends TprStandart[K]
>(change: {
  field: K
  value: T
}) => void
const allValidationErrors = inject('allValidationErrors') as ComputedRef<TprCardValidationError>
const fieldsClasses = inject('fieldsClasses') as ComputedRef<TprCardValidationError>
const disabledKeys = inject('disabledKeys') as ComputedRef<(keyof TprStandart)[]>
const computedDisable = computed(() => disabledKeys.value.includes(props.field))
</script>
