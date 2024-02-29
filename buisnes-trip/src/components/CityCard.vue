<template>
  <div class="city-card" v-if="isTableVisible">
    <TableComponent
      v-for="handbook in handbooksForRender"
      :rows="filteredHandbooks[handbook.multiplyName]"
      :columns="
        handbookColumns[`${handbook.multiplyName}_columns`].value.filter(
          (col) => col.name !== 'city_id'
        )
      "
      css-class="popup-table handbook-table"
      :allow-add="true"
      :allow-delete="true"
      :allow-edit="true"
      allow-toolbar
      :number-formating-razryad="0"
      :key="handbook.name"
      @delete-row="(e) => deleteRowHandler(e, handbook)"
      @save-row="(e) => saveRowHandler(e, handbook)"
    >
      <template #toolbar-left>
        <h2>{{ handbook.display }}</h2>
      </template>
    </TableComponent>
  </div>
</template>
<script lang="ts" setup>
import type { City } from '@/interfaces/city.interface'
import { handbooksStore } from '@/store/hanbooks.store'
import type { HandbookList } from '@/views/handbooks/useHandbooks.composable'
import useHandbooks from '@/views/handbooks/useHandbooks.composable'
import useHandbooksColumns from '@/views/handbooks/useHandbooksColumn.composable'
import { computed, ref, type ComputedRef } from 'vue'
import { TableComponent, type EditigngSaveEvent, type EditingDeleteEvent } from '@tnnc/tnnc-ui-kit'
import type { DailyPayment } from '@/interfaces/daily-payment.interface'
import type { Hotel } from '@/interfaces/hotel.interface'
import type { Ticket } from '@/interfaces/ticket.interface'

const handbooksForRender: {
  name: string
  multiplyName: keyof HandbookList
  display: string
}[] = [
  {
    name: 'plane_ticket',
    multiplyName: 'plane_tickets',
    display: 'Билеты на самолет'
  },
  {
    name: 'train_ticket',
    multiplyName: 'train_tickets',
    display: 'Билеты на поезд'
  },
  {
    name: 'hotel',
    multiplyName: 'hotels',
    display: 'Стоимость проживания'
  },
  {
    name: 'daily_payment',
    multiplyName: 'daily_payment',
    display: 'Суточные/Полевое довольствие'
  }
]
const props = defineProps<{ city: City }>()
const handbooks = handbooksStore()

const filteredHandbooks: ComputedRef<Partial<HandbookList>> = computed(() => {
  const hotels = handbooks.handbooks.hotels.filter((hotel) => hotel.city_id === props.city.id)
  const daily_payment = handbooks.handbooks.daily_payment.filter(
    (dp) => dp.city_id === props.city.id
  )
  const train_tickets = handbooks.handbooks.train_tickets.filter(
    (tt) => tt.city_id === props.city.id
  )
  const plane_tickets = handbooks.handbooks.plane_tickets.filter(
    (pt) => pt.city_id === props.city.id
  )

  return { hotels, daily_payment, train_tickets, plane_tickets }
})

const { addItem, updateItem, deleteItem } = useHandbooks()
const { handbookColumns } = useHandbooksColumns()
const isTableVisible = ref(false)
setTimeout(() => {
  isTableVisible.value = true
}, 200)

async function saveRowHandler(
  e: EditigngSaveEvent<DailyPayment | Hotel | Ticket>,
  handbook: {
    name: string
    multiplyName: keyof HandbookList
    display: string
  }
) {
  if (e.isNew) {
    await addItem(handbook.name, handbook.multiplyName, { ...e.row, city_id: props.city.id })
  } else {
    await updateItem(handbook.name, handbook.multiplyName, { ...e.row, city_id: props.city.id })
  }
  e.closeEditor()
}

async function deleteRowHandler(
  e: EditingDeleteEvent<DailyPayment | Hotel | Ticket>,
  handbook: {
    name: string
    multiplyName: keyof HandbookList
    display: string
  }
) {
  await deleteItem(handbook.name, handbook.multiplyName, e.row.id)
}
</script>
<style lang="scss">
.city-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  overflow: auto;
  .tnnc-table-toolbar {
    padding: 10px;
  }
  .popup-table {
    min-height: 200px;
  }
}
</style>
