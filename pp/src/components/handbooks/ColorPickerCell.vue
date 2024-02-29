<template>
  <input type="color" v-model="currentValue" :disabled="!editable" />
</template>
<script lang="ts" setup>
import type { TableColumn, TableRow } from 'tnnc-ui-kit'
import { computed, inject } from 'vue'

const props = defineProps<{
  isEditing?: boolean
  column: TableColumn
  row: TableRow
  invalid?: boolean
  invalidText?: string
  editable?: boolean
}>()

const setRow = props.editable ? (inject('setRow') as (newRow: TableRow) => void) : () => {}
const currentValue = computed({
  get() {
    const { editable, row, column } = props
    const value = editable ? row[column.name] : row._rawRow[column.name]
    return value ? `#${value}` : '#ffffff'
  },
  set(value) {
    if (props.editable) setRow({ ...props.row, [props.column.name]: value.split('#')[1] })
  }
})
</script>
