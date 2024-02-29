<template>
  <TableComponent
    :rows="currentHandbook"
    :columns="columns"
    css-class="stretch-table handbook-table"
    allow-add
    allow-delete
    allow-edit
    allow-pagination
    allow-toolbar
    allow-filter
    column-chooser
    :number-formating-razryad="0"
    allow-sorting
    allow-grouping
    allow-fixing
    @save-row="saveRowHandler"
    @delete-row="deleteRowHandler"
  >
    <template #toolbar-left>
      <slot name="toolbar-left"></slot>
    </template>
  </TableComponent>
</template>
<script lang="ts" setup>
import {
  TableComponent,
  type EditigngSaveEvent,
  type EditingDeleteEvent,
  confirm,
  type Column
} from '@tnnc/tnnc-ui-kit'
import { handbooksStore } from '@/store/hanbooks.store'
import { computed } from 'vue'
import NestedNumberEditorCell from './NestedNumberEditorCell.vue'
import type { City } from '@/interfaces/city.interface'
import type { Ticket } from '@/interfaces/ticket.interface'
import type { Hotel } from '@/interfaces/hotel.interface'
import type { DailyPayment } from '@/interfaces/daily-payment.interface'
import useHandbooks from '@/views/handbooks/useHandbooks.composable'

const handbook = handbooksStore()

export type CityExtendedType = City & {
  plane_tickets_7?: Ticket
  plane_tickets_8?: Ticket
  plane_tickets_9?: Ticket
  train_tickets_7?: Ticket
  train_tickets_8?: Ticket
  train_tickets_9?: Ticket
  hotels_7?: Hotel
  hotels_8?: Hotel
  hotels_9?: Hotel
  daily_payment?: DailyPayment
}

const { handbooks } = handbook
const gradeId7 = computed(() => handbooks.grades.find((grage) => grage.name === '≤ 7')?.id)
const gradeId8 = computed(() => handbooks.grades.find((grage) => grage.name === '8')?.id)
const gradeId9 = computed(() => handbooks.grades.find((grage) => grage.name === '≥ 9')?.id)

const grades = computed(() => {
  return {
    gradeId7: gradeId7.value,
    gradeId8: gradeId8.value,
    gradeId9: gradeId9.value
  }
})

const currentHandbook = computed<CityExtendedType[]>(() =>
  handbook.handbooks.cities.map((city) => {
    return {
      ...city,
      plane_tickets_7: handbook.handbooks.plane_tickets.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId7.value
      ),
      plane_tickets_8: handbook.handbooks.plane_tickets.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId8.value
      ),
      plane_tickets_9: handbook.handbooks.plane_tickets.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId9.value
      ),
      train_tickets_7: handbook.handbooks.train_tickets.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId7.value
      ),
      train_tickets_8: handbook.handbooks.train_tickets.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId8.value
      ),
      train_tickets_9: handbook.handbooks.train_tickets.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId9.value
      ),
      hotels_7: handbook.handbooks.hotels.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId7.value
      ),
      hotels_8: handbook.handbooks.hotels.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId8.value
      ),
      hotels_9: handbook.handbooks.hotels.find(
        (ticket) => ticket.city_id === city.id && ticket.grade_id === gradeId9.value
      ),
      daily_payment: handbook.handbooks.daily_payment.find((dp) => dp.city_id === city.id)
    }
  })
)

const columns: Column[] = [
  {
    name: 'name',
    columnType: 'string',
    caption: 'Город',
    editable: true
  },
  {
    name: 'is_overseas',
    columnType: 'boolean',
    editable: true,
    caption: 'Зарубежный',
    trueValue: 'Да',
    falseValue: 'Нет',
    defaultValue: false
  },
  {
    name: 'planeTicket',
    columnType: 'joined',
    caption: 'Авиа-билеты',
    child: [
      {
        name: 'planeTicket7',
        columnType: 'joined',
        caption: 'Грейд <7',
        child: [
          {
            name: 'plane_tickets_7.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      },
      {
        name: 'planeTicket8',
        columnType: 'joined',
        caption: 'Грейд 8',
        child: [
          {
            name: 'plane_tickets_8.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      },
      {
        name: 'planeTicket9',
        columnType: 'joined',
        caption: 'Грейд >9',
        child: [
          {
            name: 'plane_tickets_9.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      }
    ]
  },
  {
    name: 'trainTicket',
    columnType: 'joined',
    caption: 'Билеты на поезд',
    child: [
      {
        name: 'trainTicket7',
        columnType: 'joined',
        caption: 'Грейд <7',
        child: [
          {
            name: 'train_tickets_7.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      },
      {
        name: 'trainTicket8',
        columnType: 'joined',
        caption: 'Грейд 8',
        child: [
          {
            name: 'train_tickets_8.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      },
      {
        name: 'trainTicket9',
        columnType: 'joined',
        caption: 'Грейд >9',
        child: [
          {
            name: 'train_tickets_9.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      }
    ]
  },
  {
    name: 'hotels',
    columnType: 'joined',
    caption: 'Проживание',
    child: [
      {
        name: 'hotels7',
        columnType: 'joined',
        caption: 'Грейд <7',
        child: [
          {
            name: 'hotels_7.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      },
      {
        name: 'hotels8',
        columnType: 'joined',
        caption: 'Грейд 8',
        child: [
          {
            name: 'hotels_8.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      },
      {
        name: 'hotels9',
        columnType: 'joined',
        caption: 'Грейд >9',
        child: [
          {
            name: 'hotels_9.plan_price',
            caption: 'Цена',
            columnType: 'number',
            nestedValue: true,
            editable: true,
            templating: {
              editor: NestedNumberEditorCell
            }
          }
        ]
      }
    ]
  },
  {
    name: 'daily_payment',
    caption: 'Суточные',
    columnType: 'joined',
    child: [
      {
        name: 'daily_payment.plan_price',
        caption: 'Цена',
        columnType: 'number',
        nestedValue: true,
        editable: true,
        templating: {
          editor: NestedNumberEditorCell
        }
      }
    ]
  }
]

const { addItem, updateItem, deleteItem } = useHandbooks()
async function saveRowHandler(e: EditigngSaveEvent<CityExtendedType>) {
  let cityId = e.row.id
  if (e.isNew) {
    await addItem('city', 'cities', {
      name: e.row.name,
      is_overseas: e.row.is_overseas,
      id: 0
    }).then((data: City) => {
      cityId = data.id
    })
  } else {
    await updateItem('city', 'cities', {
      name: e.row.name,
      is_overseas: e.row.is_overseas,
      id: e.row.id
    })
  }
  const rowKeys = (Object.keys(e.row) as (keyof CityExtendedType)[]).filter(
    (key) => !key.includes('.')
  )
  const promisesList: Promise<any>[] = []
  rowKeys
    .filter((key) => key.includes('plane'))
    .forEach((key) => {
      const item = e.row[key] as Ticket
      if (item.id) {
        promisesList.push(updateItem('plane_ticket', 'plane_tickets', item))
      } else {
        promisesList.push(
          addItem('plane_ticket', 'plane_tickets', {
            id: 0,
            city_id: cityId,
            plan_price: item.plan_price || 0,
            prog_price: item.prog_price || 0,
            grade_id:
              grades.value[`gradeId${+key.split('_')[key.split('_').length - 1] as 7 | 8 | 9}`] || 0
          })
        )
      }
    })
  rowKeys
    .filter((key) => key.includes('train'))
    .forEach((key) => {
      const item = e.row[key] as Ticket
      if (item.id) {
        promisesList.push(updateItem('train_ticket', 'train_tickets', item))
      } else {
        promisesList.push(
          addItem('train_ticket', 'train_tickets', {
            id: 0,
            city_id: cityId,
            plan_price: item.plan_price || 0,
            prog_price: item.prog_price || 0,
            grade_id:
              grades.value[`gradeId${+key.split('_')[key.split('_').length - 1] as 7 | 8 | 9}`] || 0
          })
        )
      }
    })
  rowKeys
    .filter((key) => key.includes('hotel'))
    .forEach((key) => {
      const item = e.row[key] as Hotel
      if (item.id) {
        promisesList.push(updateItem('hotel', 'hotels', item))
      } else {
        promisesList.push(
          addItem('hotel', 'hotels', {
            id: 0,
            city_id: cityId,
            plan_price: +item.plan_price || 0,
            prog_price: +item.prog_price || 0,
            grade_id:
              grades.value[`gradeId${+key.split('_')[key.split('_').length - 1] as 7 | 8 | 9}`] || 0
          })
        )
      }
    })

  if (e.row.daily_payment) {
    if (e.row.daily_payment.id) {
      promisesList.push(updateItem('daily_payment', 'daily_payment', e.row.daily_payment))
    } else {
      promisesList.push(
        addItem('daily_payment', 'daily_payment', {
          id: 0,
          plan_price: `${e.row.daily_payment.plan_price || 0}`,
          prog_price: `${e.row.daily_payment.prog_price || 0}`,
          city_id: cityId
        })
      )
    }
  }
  Promise.all(promisesList).then(() => {
    e.closeEditor()
  })
}
function deleteRowHandler(e: EditingDeleteEvent<CityExtendedType>) {
  confirm('Удалить город?').then(() => {
    deleteItem('city', 'cities', e.row.id)
  })
}
</script>
