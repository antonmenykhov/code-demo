<template>
  <CollapsableBlock
    id="tpr-card-errors"
    title="Перечень ошибок"
    :collapsed="collapsed"
    @update:collapsed="
      (value) => {
        emit('update:collapsed', value)
      }
    "
  >
    <TableComponent
      css-class="errors-table"
      :rows="errorsMappedClass"
      :columns="columns"
      key-expr="code"
      :custom-manage-buttons="buttons"
    />
  </CollapsableBlock>
</template>
<script lang="ts" setup>
import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'
import { TableComponent, type Column } from 'tnnc-ui-kit'
import type { CustomManageButton } from 'tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import { computed, inject, type Ref } from 'vue'
import CollapsableBlock from './CollapsableBlock.vue'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'

const props = defineProps<{
  errors: TprError[]
  collapsed: boolean
}>()
const emit = defineEmits<{
  (e: 'update:collapsed', data: boolean): void
  (e: 'vibrateElement', data: string): void
}>()

const errorsMappedClass = computed(() =>
  props.errors.map((error) => ({ ...error, _rowCssClass: `error-level-${error.levels}` }))
)
const columns: Column[] = [
  {
    name: 'head',
    columnType: 'string',
    caption: 'Ошибка'
  },
  {
    name: 'description',
    columnType: 'string',
    caption: 'Описание'
  },
  {
    name: 'reason',
    columnType: 'string',
    caption: 'Причина'
  }
]
const manualHilightedFields = inject('manualHilightedFields') as Ref<Set<keyof TprStandart>>
const hilightedErrors = inject('hilightedErrors') as Ref<Set<number>>
const buttons: CustomManageButton[] = [
  {
    title: 'Показать поля с ошибками',
    fn(row) {
      const errorRow = row as { _rawRow: TprError }
      if (errorRow._rawRow.fields) {
        hilightedErrors.value.add(errorRow._rawRow.code)
        errorRow._rawRow.fields.forEach((field) => {
          emit('vibrateElement', field)
          manualHilightedFields.value.add(field)
        })
      }
    },
    icon: 'fa-solid fa-eye-slash',
    condition: (row) => {
      if (
        row._rawRow.fields &&
        row._rawRow.fields.length &&
        !hilightedErrors.value.has(row._rawRow.code)
      )
        return true
      return false
    }
  },
  {
    title: 'Скрыть поля с ошибками',
    fn(row) {
      const errorRow = row as { _rawRow: TprError }

      if (errorRow._rawRow.fields) {
        hilightedErrors.value.delete(errorRow._rawRow.code)
        errorRow._rawRow.fields.forEach((field) => {
          manualHilightedFields.value.delete(field)
        })
      }
    },
    icon: 'fa-solid fa-eye',
    condition: (row) => {
      if (hilightedErrors.value.has(row._rawRow.code)) return true
      return false
    }
  }
]
</script>
<style lang="scss">
.errors-table {
  height: 200px;
  margin-top: 5px;
}
.error-level-1 {
  td {
    background: rgb(211, 250, 211);
  }
}
.error-level-2 {
  td {
    background: #fcfcc8;
  }
}
.error-level-3,
.error-level-4 {
  td {
    background: rgb(250, 190, 190);
  }
}
</style>
