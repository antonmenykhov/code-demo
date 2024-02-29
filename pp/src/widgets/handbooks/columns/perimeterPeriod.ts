import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function perimeterPeriodColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())

  const perimeterPeriod = computed<Column[]>(() => [
    {
      name: 'organizationId',
      columnType: 'enum',
      caption: 'Организация',
      editable: true,
      lookup: {
        handbook: handbooks.value.organization,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },
    {
      name: 'date',
      columnType: 'date',
      caption: 'Дата перехода',
      editable: true,
      width: 600
    },
    {
      name: 'oldState',
      columnType: 'boolean',
      caption: 'Пред. состояние',
      trueValue: 'Периметр',
      falseValue: 'Сторонние',
      editable: true,
      width: 600
    }
  ])
  return { perimeterPeriod }
}
