<template>
  <SelectBox
    autocomplete-mode
    :options="similarContracts"
    display-expr="number"
    value-expr="number"
    :value="value"
    @update:value="onUpdateValue"
    :css-class="cssClass"
    :disabled="disabled"
    :invalid="invalid || !isValidContractNumber"
    :invalid-text="computedInvalidText"
    :label="label"
    placeholder="Выберите из списка или укажите свой"
  />
</template>
<script lang="ts" setup>
import useContractsStagesHttp from '@/composables/http/use-contracts-stages-http.composable'
import { useDebounceFn } from '@vueuse/core'
import { SelectBox } from 'tnnc-ui-kit'
import { computed, onBeforeMount, ref, watch } from 'vue'

const props = defineProps<{
  value: string
  label?: string
  disabled?: boolean
  cssClass?: string
  invalid?: boolean
  invalidText?: string
}>()
const emit = defineEmits<{
  (e: 'update:value', data: string): void
  (e: 'emitValidStage', data: boolean): void
}>()
const similarContracts = ref<{ number: string }[]>([])
function onUpdateValue(data: string) {
  emit('update:value', data)
  getSimilarContractsDebounced(data)
}
const { getSimilarContracts: getSimilarContractsHttp } = useContractsStagesHttp()
const getSimilarContractsDebounced = useDebounceFn(getSimilarContracts, 100)
async function getSimilarContracts(contractPart: string) {
  getSimilarContractsHttp(contractPart).then(({ data }) => {
    similarContracts.value = data
    setTimeout(() => {
      emit('emitValidStage', isValidContractNumber.value)
    })
  })
}
const propsValue = computed(() => props.value)
watch(propsValue, (newVal) => {
  getSimilarContractsDebounced(newVal)
})
onBeforeMount(() => {
  getSimilarContracts(props.value)
})

function getReplaced(string: string) {
  return string.replace(/[^а-яA-ZЁё0-9]/gi, '').toLowerCase()
}

const isValidContractNumber = computed(() =>
  similarContracts.value.some(
    (contract) => getReplaced(contract.number) === getReplaced(props.value)
  )
)
const computedInvalidText = computed(() =>
  props.invalid ? props.invalidText : 'Номер договора не из СУДа, связь невозможна'
)
</script>
