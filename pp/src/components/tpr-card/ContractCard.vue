<template>
  <div class="contract-card" v-if="visible">
    <TextInput :value="contract.id" label="ID" disabled />
    <TextInput :value="contract.number" label="Номер" disabled />
    <TextInput :value="contract.name" label="Название" disabled />
    <TextInput :value="contract.status_name" label="Статус" disabled />
    <TextInput :value="contract.type_name" label="Тип" disabled />
    <TextInput :value="contract.division_name" label="Подразделение" disabled />
    <TextInput :value="contract.curator_name" label="Куратор" disabled />
    <TextInput :value="contract.manager_name" label="Руководитель" disabled />
    <TextInput :value="contract.customer_name" label="Заказчик" disabled />
    <TextInput :value="contract.nds_name" label="НДС" disabled />
    <TextInput :value="contract.price" label="Стоиомсть всего по договору" disabled />
    <DatePicker :value="contract.start" label="Дата начала" disabled />
    <DatePicker :value="contract.finish" label="Дата окончания" disabled />
    <DatePicker
      :value="contract.realSignDate"
      label="Фактическая дата подписания договора"
      disabled
    />
    <TableComponent
      css-class="stages-table"
      :rows="stages"
      :columns="columns"
      allow-filter
      :totals="totals"
      hide-zero-numbers
    />
  </div>
</template>
<script lang="ts" setup>
import type { Contract } from '@/interfaces/contracts-entities/contract.interface'
import { DatePicker, getFormateValue, TableComponent, TextInput, type Column } from 'tnnc-ui-kit'
import type { TableTotal } from 'tnnc-ui-kit/dist/interfaces/table-props.interface'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  contract: Contract
}>()
const stages = computed(() =>
  [...props.contract.stages].sort((a, b) => {
    if (a.contentsNumber === null) {
      return -1
    }
    const aArr: string[] = a.contentsNumber.split('.')
    const bArr: string[] = b.contentsNumber.split('.')
    for (let i = 0; i < (aArr.length >= bArr.length ? aArr.length : bArr.length); i++) {
      if (aArr[i] !== bArr[i]) return +aArr[i] - +bArr[i]
    }
    return 0
  })
)
const columns: Column[] = [
  {
    name: 'contentsNumber',
    caption: 'Номер',
    columnType: 'string',
    width: 100
  },
  {
    name: 'name',
    caption: 'Название',
    columnType: 'string',
    width: 800
  },
  {
    name: 'start',
    caption: 'Дата начала',
    columnType: 'date'
  },
  {
    name: 'finish',
    caption: 'Дата окончания',
    columnType: 'date'
  },
  {
    name: 'durationCD',
    caption: 'Продолжительность, кал. дней',
    columnType: 'number'
  },
  {
    name: 'durationWD',
    caption: 'Продолжительность, раб. дней',
    columnType: 'number'
  },
  {
    name: 'nds_name',
    caption: 'НДС',
    columnType: 'computed',
    computing: {
      value(rowData) {
        return rowData.nds_name || '(Пусто)'
      }
    }
  },
  {
    name: 'price',
    caption: 'Стоимость',
    columnType: 'number'
  }
]
const totals = computed<TableTotal[]>(() =>
  props.contract.indexes.map((index) => ({
    name: `Итого за ${index.year}`,
    function: (column) => {
      if (column.name === 'nds_name') return `Итого за ${index.year}`
      if (column.name === 'price') return getFormateValue(index.totalYear)
      return ''
    }
  }))
)

const visible = ref(false)
onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, 200)
})
</script>
<style lang="scss">
.contract-card {
  overflow: auto;
  .tnnc-input-labeled {
    flex-direction: row;
    align-items: center;
    label {
      margin: 0;
      width: 300px;
      text-align: right;
      padding-right: 10px;
    }
    input {
      padding: 3px;
      border-bottom: 1px solid var(--tnnc-add-color-gray-4);
    }
  }
  .stages-table {
    height: 492px;
    .contentsNumber {
      text-align: right;
    }
  }
}
</style>
