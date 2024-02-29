import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import type { TprHandbookExtended } from '@/widgets/handbooks/composables/useHandbooks.composable'
import type { TableColumn, TableComponent } from 'tnnc-ui-kit'
import { computed, ref, type ComputedRef, type Ref, onMounted } from 'vue'
import { useLoadingState } from '@/store/loading.state'

export default function useTprExternalFilters(
  table: Ref<InstanceType<typeof TableComponent> | undefined>,
  monthHandbookExtended: ComputedRef<
    {
      id: string
      name: string
    }[]
  >,
  choosedMonths: Ref<string[]>,
  choosedForceTypes: Ref<string[]>,
  choosedIndexTypes: Ref<string[]>,
  rows: Ref<TprStandart[]>,
  handbooks: Ref<TprHandbookExtended>,
  errors: Ref<TprError[]>
) {
  function filterRecursive(columns: TableColumn[], name: string, value: string) {
    const findedColumns: TableColumn[] = []
    columns.forEach((column) => {
      if (column.meta?.[name] === value) findedColumns.push(column)
      if (column.child) findedColumns.push(...filterRecursive(column.child, name, value))
    })
    return findedColumns
  }
  const monthsColumns = computed(() => {
    if (table.value) {
      const obj: { [key: string]: TableColumn[] } = {}
      monthHandbookExtended.value.forEach((month) => {
        if (table.value)
          obj[month.id] = filterRecursive(table.value.tableColumnsTree, 'month', month.id)
      })
      return obj
    }
    return null
  })

  function setRenderedColumns() {
    if (table.value && monthsColumns.value) {
      let renderedColumnsIds = table.value.renderedColumnsIds
      Object.keys(monthsColumns.value).forEach((key) => {
        renderedColumnsIds = renderedColumnsIds.filter(
          (columnId) => !monthsColumns.value?.[key].find((column) => column.id === columnId)
        )
      })
      choosedMonths.value.forEach((month) => {
        if (monthsColumns.value && monthsColumns.value[month])
          renderedColumnsIds.push(
            ...monthsColumns.value[month]
              .filter((column) => {
                if (column.meta && column.meta['force']) {
                  return choosedForceTypes.value.includes(column.meta['force'])
                }
                return true
              })
              .filter((column) => {
                if (column.meta && column.meta['type']) {
                  return choosedIndexTypes.value.includes(column.meta['type'])
                }
                return true
              })
              .map((column) => column.id)
          )
      })
      table.value.setSettings({ renderedColumnsIds })
    }
  }

  const choosedBlocks = ref<number[]>([])

  const filteredByBlockRows = computed(() => {
    if (choosedBlocks.value.length > 0) {
      const departmentNames = handbooks.value.department
        .filter((department) =>
          department.blockDepartmentId
            ? choosedBlocks.value.includes(department.blockDepartmentId)
            : false
        )
        .map((department) => department.name)
      return rowsFiltereredByErrorOption.value.filter((row) =>
        departmentNames.includes(row.department_Staff_Project)
      )
    }
    return rowsFiltereredByErrorOption.value
  })

  const errorFilterOptions = [
    {
      id: 'all',
      caption: 'Все'
    },
    {
      id: 'with',
      caption: 'С ошибками'
    },
    {
      id: 'without',
      caption: 'Без ошибок'
    }
  ]

  const selectedErrorFilterOption = ref<string>('all')

  const rowsFiltereredByErrorOption = computed(() => {
    if (selectedErrorFilterOption.value === 'with')
      return rows.value.filter((row) => errors.value.find((error) => error.ID === row.ID))
    if (selectedErrorFilterOption.value === 'without')
      return rows.value.filter((row) => !errors.value.find((error) => error.ID === row.ID))
    return rows.value
  })

  const { setManualLoading } = useLoadingState()

  function setChoosedBlocks(blocks: number[]) {
    setManualLoading(true)
    setTimeout(() => {
      choosedBlocks.value = blocks
    }, 50)
  }
  function setSelectedError(newVal: string) {
    setManualLoading(true)
    setTimeout(() => {
      selectedErrorFilterOption.value = newVal
    }, 50)
  }
  function tableUpdated() {
    setTimeout(() => {
      setManualLoading(false)
    }, 1)
  }

  onMounted(() => {
    setRenderedColumns()
  })

  return {
    setRenderedColumns,
    choosedBlocks,
    filteredByBlockRows,
    errorFilterOptions,
    selectedErrorFilterOption,
    setChoosedBlocks,
    setSelectedError,
    tableUpdated
  }
}
