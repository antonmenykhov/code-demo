import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'
import NoNdsPositionCell from '@/components/handbooks/NoNdsPositionCell.vue'

export default function noNdsColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const noNds = computed<Column[]>(() => [
    {
      name: 'isContract',
      columnType: 'boolean',
      caption: 'Тип позиции',
      editable: true,
      trueValue: 'Договор',
      falseValue: 'Контрагент'
    },
    {
      name: 'positionId',
      columnType: 'enum',
      caption: 'Контрагент/Договор',
      editable: true,
      templating: {
        cell: NoNdsPositionCell,
        editor: NoNdsPositionCell
      },
      lookup: {
        handbook: [...handbooks.value.organization, ...handbooks.value.numberContract],
        valueExpr: 'id',
        displayExpr: 'name',
        idExpr: 'id'
      },
      width: 900
    }
  ])

  return { noNds }
}
