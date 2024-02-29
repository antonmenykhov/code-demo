<template>
  <SelectBox
    :options="currentHandbook || []"
    v-model:value="currentValue"
    :disabled="!editable"
    value-expr="id"
    display-expr="name"
    allow-search
  />
</template>
<script lang="ts" setup>
import { SelectBox, TableColumn, type TableRow } from 'tnnc-ui-kit'
import { computed, inject } from 'vue'

const props = defineProps<{
  isEditing?: boolean
  column: TableColumn
  row: TableRow
  invalid?: boolean
  invalidText?: string
  editable?: boolean
}>()
const currentHandbook = computed(() => {
  const { editable, row, column } = props
  if (editable) {
    return column.lookup?.handbook?.filter((item) =>
      !row['isContract'] ? 'industrialBlockId' in item : 'idContract' in item
    )
  }
  return column.lookup?.handbook?.filter((item) =>
    !row._rawRow['isContract'] ? 'industrialBlockId' in item : 'idContract' in item
  )
})

const currentValue = computed({
  get() {
    const { editable, row, column } = props
    return editable ? row[column.name] : row._rawRow[column.name]
  },
  set(value) {
    if (props.editable) setRow({ ...props.row, [props.column.name]: value })
  }
})

const setRow = props.editable ? (inject('setRow') as (newRow: TableRow) => void) : () => {}
</script>
