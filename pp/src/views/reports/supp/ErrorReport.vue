<template>
  <TableComponent
    allow-toolbar
    key-expr="levels"
    :rows="filteredErrors"
    :columns="columns"
    allow-filter
    allow-sorting
    allow-fixing
    allow-grouping
    allow-pagination
    allow-export
    additional-features
    css-class="stretch-table"
    :custom-manage-buttons="buttons"
  >
    <template #toolbar-left>
      <YearChooser v-model:year="year" @update:year="getAllErrors" />
    </template>
  </TableComponent>
</template>
<script lang="ts" setup>
import YearChooser from '@/components/general/YearChooser.vue'
import useTprErrors from '@/widgets/tpr-table/composables/useTprErrors.composable'
import useTprRoles from '@/widgets/tpr-table/composables/useTprRoles.composable'
import { TableComponent, type Column } from 'tnnc-ui-kit'
import type { CustomManageButton } from 'tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const year = ref(new Date().getFullYear())
const { errors, getAllErrors } = useTprErrors(year)
const columns: Column[] = [
  {
    name: 'ID',
    columnType: 'number',
    formating: { disable: true },
    caption: '№ ТПР',
    width: 100
  },
  {
    name: 'head',
    columnType: 'string',
    caption: 'Ошибка',
    width: 300
  },
  {
    name: 'description',
    columnType: 'string',
    caption: 'Описание'
  },
  {
    name: 'contract',
    columnType: 'string',
    caption: 'Номер договора',
    width: 200
  },
  {
    name: 'department',
    columnType: 'string',
    caption: 'Управление',
    width: 200
  }
]
await getAllErrors()
const router = useRouter()
const buttons: CustomManageButton[] = [
  {
    fn(row) {
      const route = router.resolve({ path: '/tpr', query: { id: row.ID } })
      window.open(route.href, '_blank')
    },
    icon: 'fa-solid fa-file',
    title: 'Открыть карточку'
  }
]
const { availableDepartments } = useTprRoles()
const filteredErrors = computed(() =>
  errors.value
    .filter((error) => availableDepartments.value.find((dep) => dep.name === error.department))
    .map((error, index) => {
      error.levels = index
      return error
    })
)
</script>
