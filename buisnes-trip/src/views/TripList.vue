<template>
  <div class="container">
    <TableComponent
      ref="table"
      :rows="rows"
      :columns="columns"
      css-class="stretch-table"
      :allow-delete="canEdit"
      :allow-edit="canEdit"
      allow-pagination
      allow-toolbar
      allow-filter
      allow-sorting
      allow-grouping
      allow-fixing
      column-chooser
      :custom-manage-buttons="canEdit ? customButtons : []"
      :number-formating-razryad="0"
      :groupRowsDefaultStateOpened="isCurator || isManager"
      :header-totals="totals"
      show-group-counter
      show-total-counter
      @delete-row="deleteRowHandler"
      @start-editing="startEditingHandler"
    >
      <template #toolbar-right-before>
        <ButtonComponent
          v-if="!isEconomist && !isAdmin"
          :text="isEditingOpened ? `Закрыть редактирование` : `Открыть редактирование`"
          @click="toggleIsEditing"
        />
        <ButtonComponent v-if="canEdit" text="Добавить лимит" @click="addLimit" />
        <ButtonComponent v-if="canEdit" text="Добавить" @click="createNewTrip" />
        <UserSettings :table="table" resource="tripList" />
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import useBusinessTrip from '@/composables/use-business-trip.composable'
import {
  type Column,
  TableComponent,
  type EditingDeleteEvent,
  type EditingStartEvent,
  confirm,
  type TableRow,
  ButtonComponent,
  type TableTotal
} from '@tnnc/tnnc-ui-kit'
import { computed, onMounted, ref } from 'vue'
import type { BuisnessTrip } from '@/interfaces/buisness-trip.interface'
import { useRouter } from 'vue-router'
import { handbooksStore } from '@/store/hanbooks.store'
import type { CustomManageButton } from '@tnnc/tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import { formatNumberValue } from '@/hooks/format.hook'
import { storeToRefs } from 'pinia'
import { roleStore } from '@/store/role.store'
import useUserStatus from '@/composables/use-user-status.composable'
import UserSettings from '@/components/UserSettings.vue'
import { tripStore } from '@/store/trips.store'

const { isEditingOpened, isAdmin, isEconomist, isCurator, isManager } = storeToRefs(roleStore())
const canEdit = computed(() => isEditingOpened.value || isAdmin.value || isEconomist.value)
const { toggleIsEditing } = useUserStatus()
const { getAll, remove } = useBusinessTrip()
const handBooksStore = handbooksStore()
const { trips: rows } = storeToRefs(tripStore())

rows.value = await getAll()
const columns = computed(() => {
  const columns: Column[] = [
    {
      name: 'fin_structure.code',
      caption: 'Код подразделения',
      columnType: 'string'
    },
    {
      name: 'fin_structure.department_name_sr',
      caption: 'Подразделение',
      columnType: 'string'
    },
    {
      name: 'fin_structure.mvz_name',
      caption: 'МВЗ',
      columnType: 'string'
    },
    {
      name: 'city_id',
      caption: 'Город',
      columnType: 'enum',
      lookup: {
        handbook: handBooksStore.handbooks.cities,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },
    {
      name: 'trip_purpose.trip_goal.goal_name',
      caption: 'Цель',
      columnType: 'string'
    },
    {
      name: 'grade_id',
      caption: 'Грейд',
      columnType: 'enum',
      lookup: {
        handbook: handBooksStore.handbooks.grades,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },

    {
      name: 'start_date',
      caption: 'Дата начала',
      columnType: 'date'
    },
    {
      name: 'end_date',
      caption: 'Дата окончания',
      columnType: 'date'
    },
    {
      name: 'transportTypes',
      caption: 'Виды транспорта',
      columnType: 'computedText',
      computing: {
        value: (rowData: BuisnessTrip) => {
          let types = ''
          if (rowData.plane_ticket_id) types += 'Авиа '
          if (rowData.train_ticket_id) types += 'Поезд '
          if (rowData.taxi_ticket_plan_price) types += 'Такси'
          if (rowData.copter_ticket_plan_price) types += 'Вертолет'
          return types.length ? types : '(Пусто)'
        }
      },
      excludeFromTotals: true
    },
    {
      name: 'total_cost',
      caption: 'Cтоимость командировки',
      columnType: 'number'
    },
    {
      name: 'people_count',
      caption: 'Кол-во командируемых',
      columnType: 'number'
    },
    {
      name: 'comment',
      caption: 'Комментарий',
      columnType: 'string'
    }
  ]
  return columns
})

async function deleteRowHandler(e: EditingDeleteEvent<BuisnessTrip>) {
  confirm('Удалить командировку?')
    .then(() => {
      remove(e.row).then(() => {
        const index = rows.value.findIndex((row) => row.id === e.row.id)
        rows.value.splice(index, 1)
      })
    })
    .catch(() => {})
}

const router = useRouter()
function startEditingHandler(e: EditingStartEvent<BuisnessTrip>) {
  e.stop()
  router.push({
    path: `/${String(e.row.city_id) === '(Пусто)' ? 'limit' : 'trip'}-card/${e.row.id}`
  })
}

function createNewTrip() {
  router.push({
    path: `/trip-card/new`
  })
}

function copyButtonHandler(row: TableRow & BuisnessTrip) {
  router.push({
    path: `/${String(row.city_id) === '(Пусто)' ? 'limit' : 'trip'}-card/${row.id}`,
    query: { type: 'copy' }
  })
}

function addLimit() {
  router.push({
    path: `/limit-card/new`
  })
}

const customButtons: CustomManageButton[] = [
  {
    fn: copyButtonHandler,
    icon: 'fa-solid fa-copy',
    title: 'Копировать'
  }
]

const totals: TableTotal[] = [
  {
    name: 'Итого',
    function(column, rows, ed, razryd) {
      const sum = rows.reduce((acc, row) => {
        const value = ((column.columnType !== 'computed' ? row['_rawRow'] : row) as TableRow)[
          column.name
        ]
        if (value && !isNaN(+value)) acc += +value
        return acc
      }, 0)
      return formatNumberValue(sum, ed, razryd)
    }
  }
]

const table = ref<InstanceType<typeof TableComponent>>()
onMounted(() => {
  if (table.value) {
    const column = table.value.tableColumnsTree.find(
      (col: Column) => col.name === 'fin_structure.department_name_sr'
    )
    if (column) {
      table.value.toggleGrouping(column.id)
    }
  }
})
</script>
