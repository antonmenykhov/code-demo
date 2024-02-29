<template>
  <div class="status-with-history-cell">
    <i
      title="История событий"
      class="fa-solid fa-clock"
      v-if="isHistoryIconVisible"
      @click="getActionHistoryAndShowPopup"
    ></i>
    {{ value }}
    <PopupComponent
      height="400px"
      width="900px"
      v-model:visible="isPopupVisible"
      title="История событий КД"
      close-on-outside-click
    >
      <TableComponent class="action-history-table" :columns="columns" :rows="history" />
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { ActionHistory } from '@/interfaces/action-history.interface'
import type { AnswerActionRowDto } from '@/interfaces/answer-action-row.interface'
import type { Employee } from '@/interfaces/employee.interface'
import type { AxiosInstance } from 'axios'
import {
  PopupComponent,
  TableComponent,
  type Column,
  type TableColumn,
  type TableRow
} from 'tnnc-ui-kit'
import { computed, inject, ref } from 'vue'

const props = defineProps<{
  row: TableRow & { _rawRow?: AnswerActionRowDto }
  column: TableColumn
  meta: {
    employees: Employee[]
    isAdministrator: boolean
    isResponsible: boolean
    isManager: boolean
  }
}>()

const value = computed(() => props.row[props.column.name])
const isPopupVisible = ref(false)
const http = inject('http') as AxiosInstance

async function getActionHistoryAndShowPopup() {
  http
    .get(
      `${baseUrl.baseUrl}/action-history/${
        // @ts-ignore
        props.row._rawRow?.correctAction?.id || props.row.correctAction?.id
      }`
    )
    .then(({ data }) => {
      history.value = data
    })
  isPopupVisible.value = true
}

const isHistoryIconVisible = computed(
  () =>
    (props.meta.isAdministrator || props.meta.isManager) &&
    (props.row._rawRow?.correctAction || props.row.correctAction)
)

const history = ref<ActionHistory[]>([])
const columns = computed<Column[]>(() => [
  {
    name: 'date',
    caption: 'Дата события',
    columnType: 'datetime',
    width: 150
  },
  {
    name: 'userId',
    caption: 'Пользователь',
    columnType: 'enum',
    lookup: {
      handbook: props.meta.employees,
      displayExpr: 'fullFio',
      valueExpr: 'employeeId',
      idExpr: 'employeeId'
    },
    width: 294
  },
  {
    name: 'event',
    caption: 'Событие',
    columnType: 'string',
    width: 410
  }
])
</script>

<style lang="scss">
.status-with-history-cell {
  i {
    cursor: pointer;
  }
}
.action-history-table {
  height: 325px;
}
</style>
