<template>
  <TextInput
    :value="(choosedRow[field] as string)"
    :label="label"
    :disabled="disabled || computedDisable"
    :css-class="`${cssClass} ${field} ${fieldsClasses[field]} card-input`"
    :invalid="allValidationErrors[field] !== undefined"
    :invalid-text="allValidationErrors[field]"
    :data-field="field"
    @update:value="(val) => setChange({ field: field, value: `${val}` })"
  />
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { TextInput } from 'tnnc-ui-kit'
import { inject, type ComputedRef, computed } from 'vue'
import type { TprCardValidationError } from '@/widgets/tpr-card/composables/useCardValidations.composable'

const props = defineProps<{
  field: keyof TprStandart
  choosedRow: TprStandart
  label: string
  cssClass?: string
  disabled?: boolean
}>()

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
