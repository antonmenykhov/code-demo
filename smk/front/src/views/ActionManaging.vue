<template>
  <div class="container">
    <h1>Корректирующие действия</h1>
    <TableComponent
      :rows="filteredRows"
      :columns="columnsCached"
      allow-toolbar
      allow-filter
      column-chooser
      css-class="stretch-table actions-table"
      allow-export
      allow-sorting
      allow-grouping
      allow-fixing
      additional-features
      :allow-edit="allowEdit"
      :allow-pagination="rows.length > 100"
      :meta="meta"
      key-expr="id"
      @save-row="saveRow"
      :number-formating-razryad="0"
      :export-name="`Отчет о КД за ${currentPeriodName}`"
      autosave-row
    >
      <template #toolbar-left>
        <SelectBox
          v-model:value="currentPeriod"
          :options="periods"
          displayExpr="periodName"
          value-expr="id"
          allow-search
          @update:value="getRows"
          label="Период"
        />
        <SendResultsButton
          v-if="!currentPeriodIsSended && isAdministrator"
          :periodId="currentPeriod"
        />
        <SendActionsButton
          v-if="isResponsible"
          :period-id="currentPeriod"
          :rows="rows"
          :http="http"
          @actions-sended="getRows"
        />
        <SendReturnungButton v-if="isAdministrator" :rows="rows" />
        <AprooveGdButton v-if="isAdministrator" :rows="rows" @action-aprooved="getRows" />
        <TagComponent
          v-if="filteredDepartmentName"
          :allow-delete="true"
          :text="`${filteredDepartmentName.slice(0, 20)}...`"
          @deleted="() => (filteredDepartmentName = null)"
        />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import AprooveGdButton from '@/components/AprooveGdButton.vue'
import FileManagmentCell from '@/components/FileManagmentCell.vue'
import ManageButtonsCell from '@/components/ManageButtonsCell.vue'
import MultiplyEnumCell from '@/components/MultiplyEnumCell.vue'
import SendActionsButton from '@/components/SendActionsButton.vue'
import SendResultsButton from '@/components/SendResultsButton.vue'
import SendReturnungButton from '@/components/SendReturnungButton.vue'
import StatusWithHistoryCell from '@/components/StatusWithHistoryCell.vue'
import useEmployees from '@/composables/use-employees.composable'
import usePeriods from '@/composables/use-periods.composable'
import baseUrl from '@/config/baseUrl'
import type { ActionReportRow } from '@/interfaces/action-report-row.interface'
import { useRoleStore } from '@/store'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { storeToRefs } from 'pinia'
import {
  type Column,
  TableComponent,
  SelectBox,
  type EditigngSaveEvent,
  TagComponent,
  notify
} from 'tnnc-ui-kit'
import {
  computed,
  inject,
  ref,
  type Ref,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  markRaw
} from 'vue'
import { useRoute } from 'vue-router'

const roleStore = useRoleStore()
const { isAdministrator, isManager, isResponsible } = storeToRefs(roleStore)
const http = inject('http') as AxiosInstance
const silentHttp = inject('silentHttp') as AxiosInstance
const url = `${baseUrl.baseUrl}/action`
const { employees } = useEmployees()
const { periods } = usePeriods()
const currentPeriod: Ref<null | number> = ref(null)
const filteredDepartmentName: Ref<null | string> = ref(null)
const route = useRoute()

const isReportOpenedValidation = (
  rowData: ActionReportRow & { _rawRow: ActionReportRow },
  column: Column
) => {
  if (rowData.state?.reportOpened && isResponsible.value) {
    const value = rowData[column.name as keyof ActionReportRow]
    if (value === null || value === undefined || value === '')
      return { isValid: false, message: 'Поле обязательно к заполнению!' }
  }
  return { isValid: true, message: '' }
}

const columns = computed(() => {
  const columnEmployees = employees.value
  const columns: Column[] = [
    {
      name: 'id',
      caption: '№',
      columnType: 'string',
      width: 50
    },
    {
      name: 'groupText',
      caption: 'Структурное подразделение',
      columnType: 'string',
      rendered: isAdministrator.value || isManager.value
    },
    {
      name: 'questionText',
      caption: 'Процесс (Направление деятельности)',
      columnType: 'string'
    },
    {
      name: 'numericVariant',
      caption: 'Оценка',
      columnType: 'number',
      width: 50
    },
    {
      name: 'userId',
      caption: 'ФИО респондента',
      columnType: 'enum',
      rendered: isAdministratorOrManager.value,
      excludeFromColumnChooser: !isAdministratorOrManager.value,
      lookup: {
        handbook: employees.value,
        displayExpr: 'fullFio',
        valueExpr: 'employeeId',
        idExpr: 'employeeId'
      }
    },
    {
      name: 'comment',
      caption: 'Несоответствие/Замечание/Предложение',
      columnType: 'string',
      editable: isAdministrator.value && !currentPeriodIsSended.value,
      width: 250
    },
    {
      name: 'reason',
      caption: 'Причина несоответствия/замечания',
      columnType: 'string',
      rendered: currentPeriodIsSended.value,
      excludeFromColumnChooser: !currentPeriodIsSended.value,
      editable: isResponsible.value || isAdministrator.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          return (
            (rowData._rawRow.state ? rowData._rawRow.state.kdOpened : true) || isAdministrator.value
          )
        }
      },
      validation: {
        isReqired: isResponsible.value
      },
      width: 250
    },
    {
      name: 'action',
      caption: 'Корректирующее действие/мероприятие',
      columnType: 'string',
      rendered: currentPeriodIsSended.value,
      excludeFromColumnChooser: !currentPeriodIsSended.value,
      editable: isResponsible.value || isAdministrator.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          return (
            (rowData._rawRow.state ? rowData._rawRow.state.kdOpened : true) || isAdministrator.value
          )
        }
      },
      validation: {
        isReqired: isResponsible.value
      },
      width: 250
    },
    {
      name: 'responsible',
      caption: 'Ответственный исполнитель',
      columnType: 'computedText',
      lookup: {
        handbook: columnEmployees,
        displayExpr: 'fullFio',
        valueExpr: 'employeeId',
        idExpr: 'employeeId'
      },
      rendered: currentPeriodIsSended.value,
      excludeFromColumnChooser: !currentPeriodIsSended.value,
      editable: isResponsible.value || isAdministrator.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          return (
            (rowData._rawRow.state ? rowData._rawRow.state.kdOpened : true) || isAdministrator.value
          )
        },
        value: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          if (!rowData.responsible) return '(Пусто)'
          const valuesList = rowData.responsible.split(';')
          const displayList = valuesList.map((value) => {
            const item = employees.value.find((emp) => emp.employeeId === value)
            if (item) return item.fullFio
            return value
          })
          return displayList.join('; ')
        }
      },
      templating: {
        editor: markRaw(MultiplyEnumCell)
      },
      validation: {
        isReqired: isResponsible.value
      }
    },
    {
      name: 'dates',
      caption: 'Срок исполнения',
      columnType: 'date',
      child: [
        {
          name: 'dateFinish',
          caption: 'План',
          columnType: 'date',
          rendered: currentPeriodIsSended.value,
          excludeFromColumnChooser: !currentPeriodIsSended.value,
          editable: isResponsible.value || isAdministrator.value,
          computing: {
            editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
              return (
                (rowData._rawRow.state ? rowData._rawRow.state.kdOpened : true) ||
                isAdministrator.value
              )
            }
          },
          validation: {
            isReqired: isResponsible.value
          }
        },
        {
          name: 'factDateFinish',
          caption: 'Факт',
          columnType: 'date',
          rendered: currentPeriodIsSended.value,
          excludeFromColumnChooser: !currentPeriodIsSended.value,
          editable: isResponsible.value || isAdministrator.value,
          computing: {
            editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
              return (
                (rowData._rawRow.state ? rowData._rawRow.state.reportOpened : false) ||
                isAdministrator.value
              )
            }
          },
          validation: {
            func: isReportOpenedValidation
          }
        }
      ]
    },

    {
      name: 'completeComment',
      caption: 'Отчет о выполнении',
      columnType: 'string',
      rendered: maxStateId.value >= 6,
      excludeFromColumnChooser: maxStateId.value < 6,
      editable: isResponsible.value || isAdministrator.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          return rowData._rawRow.state?.reportOpened || isAdministrator.value
        }
      },
      validation: {
        func: isReportOpenedValidation
      }
    },
    {
      name: 'documents-cell',
      caption: 'Подтверждающие документы',
      columnType: 'manage',
      rendered: maxStateId.value >= 6,
      excludeFromColumnChooser: maxStateId.value < 6,
      editable: isResponsible.value || isAdministrator.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          return (
            (rowData._rawRow.stateId <= 8 && rowData._rawRow.stateId >= 6) || isAdministrator.value
          )
        }
      },
      templating: {
        editor: markRaw(FileManagmentCell),
        cell: markRaw(FileManagmentCell)
      },
      width: 150
    },
    {
      name: 'administratorComment',
      columnType: 'string',
      caption: 'Комментарий администратора',
      editable: isAdministrator.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          if (rowData._rawRow.state) return true
          return false
        }
      }
    },
    {
      caption: 'Статус',
      columnType: 'string',
      name: 'stateText',
      templating: {
        cell: markRaw(StatusWithHistoryCell),
        editor: markRaw(StatusWithHistoryCell)
      }
    },
    {
      name: 'managerComment',
      columnType: 'string',
      caption: 'Комментарий начальника ОСТРиМК',
      rendered: isAdministratorOrManager.value && currentPeriodIsSended.value,
      excludeFromColumnChooser: !isAdministratorOrManager.value,
      editable: isManager.value,
      computing: {
        editing: (rowData: ActionReportRow & { _rawRow: ActionReportRow }) => {
          if (rowData._rawRow.state) return true
          return false
        }
      }
    },
    {
      caption: 'Управление состоянием',
      columnType: 'manage',
      name: 'stateManaging',
      templating: {
        cell: markRaw(ManageButtonsCell)
      },
      width: 130
    }
  ]

  return columns.filter((column) => column.rendered !== false)
})

const columnsCached: Ref<Column[]> = ref([])

const rows: Ref<ActionReportRow[]> = ref([])
const hilightedRows = computed(() =>
  rows.value.map((row) => {
    return {
      ...row,
      _rowCssClass:
        row.state?.isReturnedState || new Date(row.dateFinish) < new Date()
          ? 'hilighted-returned-row'
          : ''
    } as ActionReportRow & { _rowCssClass: string }
  })
)
const filteredRows = computed(() =>
  filteredDepartmentName.value
    ? hilightedRows.value.filter((row) => row.groupText === filteredDepartmentName.value)
    : hilightedRows.value
)
async function getRows() {
  if (currentPeriod.value)
    http.get(`${url}/${currentPeriod.value}`).then(({ data }) => {
      rows.value = (data as ActionReportRow[]).map((actionRow) => {
        if (!actionRow.correctAction) {
          actionRow.responsible = ''
        }
        return actionRow
      })
    })
}
const isAdministratorOrManager = computed(() => isAdministrator.value || isManager.value)
const allowEdit = computed(() => isAdministratorOrManager.value || isResponsible.value)
const maxStateId = computed(() => {
  let maxState = 0
  rows.value.forEach((row) => {
    if (row.stateId) {
      maxState = maxState > row.stateId ? maxState : row.stateId
    }
  })
  return maxState
})
const currentPeriodIsSended = computed(() => {
  const period = periods.value.find((per) => per.id === currentPeriod.value)
  return period?.resultsSended || false
})

const currentPeriodName = computed(() =>
  currentPeriod.value
    ? periods.value.find((period) => period.id === currentPeriod.value)?.periodName
    : ''
)

const meta = computed(() => ({
  isAdministrator: isAdministrator.value,
  isResponsible: isResponsible.value,
  isManager: isManager.value,
  http,
  employees: employees.value
}))

async function saveRow(e: EditigngSaveEvent<ActionReportRow>) {
  const promisesList: Promise<AxiosResponse>[] = []
  const diffPropertyNames = Object.getOwnPropertyNames(e.diff)
  const has = (propertyName: string) => diffPropertyNames.includes(propertyName)
  if (has('comment')) {
    promisesList.push(
      silentHttp.patch(`${baseUrl.baseUrl}/answer/comment/${e.row.id}`, {
        comment: e.diff.comment
      })
    )
  }
  if (has('administratorComment')) {
    promisesList.push(
      silentHttp.post(`${url}/comment/administrator/${e.row.correctAction?.id}`, {
        comment: e.diff.administratorComment
      })
    )
  }
  if (has('managerComment')) {
    promisesList.push(
      silentHttp.post(`${url}/comment/manager/${e.row.correctAction?.id}`, {
        comment: e.diff.managerComment
      })
    )
  }
  if (has('reason') || has('responsible') || has('action') || has('dateFinish')) {
    if (e.row.correctAction) {
      promisesList.push(
        silentHttp.patch(`${url}/${e.row.correctAction.id}`, {
          reason: e.row.reason,
          responsible: e.row.responsible,
          action: e.row.action,
          dateFinish: e.row.dateFinish,
          answerId: e.row.id
        })
      )
    } else {
      promisesList.push(
        silentHttp.post(`${url}`, {
          reason: e.row.reason,
          responsible: e.row.responsible,
          action: e.row.action,
          dateFinish: e.row.dateFinish,
          answerId: e.row.id
        })
      )
    }
  }

  if (has('completeComment') || has('factDateFinish')) {
    promisesList.push(
      silentHttp.post(`${url}/complete/${e.row.correctAction?.id}`, {
        comment: e.diff.completeComment,
        date: e.row.factDateFinish
      })
    )
  }

  Promise.all(promisesList)
    .then(() => {
      e.closeEditor()
      getRows()
      notify('Данные сохранены')
    })
    .catch(() => {
      notify('Ошибка при сохранении данных, проверьте правильность заполнения полей', 'danger')
    })
}

onBeforeMount(() => {
  document.addEventListener('need-update-rows', getRows)
  if (route.query.periodId && isFinite(+route.query.periodId)) {
    currentPeriod.value = +route.query.periodId
    getRows()
  }
  if (route.query.departmentName) {
    filteredDepartmentName.value = decodeURI(route.query.departmentName as string)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('need-update-rows', getRows)
})
watch(columns, (newColumns) => {
  if (newColumns.length !== columnsCached.value.length) columnsCached.value = [...newColumns]
})
watch(periods, (newVal) => {
  if (!currentPeriod.value && newVal.length > 0) {
    currentPeriod.value = newVal[newVal.length - 1].id
    getRows()
  }
})
</script>
<style lang="scss">
.hilighted-returned-row {
  background: rgba(255, 0, 0, 0.39);
}
.actions-table {
  col:first-child {
    width: 50px !important;
  }
}
</style>
