<template>
  <NumberInput :value="value" @update:value="setValue" />
</template>
<script lang="ts" setup>
import { type Column, type TableRow, NumberInput } from '@tnnc/tnnc-ui-kit'
import { computed, inject } from 'vue'

const props = defineProps<{
  isEditing?: boolean
  column: Column
  row: TableRow
  masterDetailOpened: Set<string>
  selectedRowsIds: Set<string>
  hasInvalidValues?: boolean
  meta?: {
    isBlocked: boolean
  }
}>()
const value = computed(
  () => +props.column.name.split('.').reduce<any>((a, b) => a?.[b] || '', props.row)
)
const setRow = inject('setRow') as (newRow: TableRow) => void

function setValue(newValue: number | null) {
  const newRow = JSON.parse(JSON.stringify(props.row))
  let obj = newRow
  const nameArr = props.column.name.split('.')
  nameArr.slice(0, nameArr.length - 1).forEach((name) => {
    if (!obj[name]) obj[name] = {}
    obj = obj[name]
  })
  obj[nameArr[nameArr.length - 1]] = newValue
  setRow(newRow)
}
</script>
