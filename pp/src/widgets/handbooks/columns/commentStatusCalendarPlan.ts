import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function commentStatusCalendarPlanColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const commentStatusCalendarPlan = computed<Column[]>(() => [
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'statusCalendarPlanId',
      columnType: 'enum',
      caption: 'Статус',
      editable: true,
      width: 200,
      lookup: {
        handbook: handbooks.value.statusCalendarPlan,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },
    {
      name: 'isGenwork',
      columnType: 'enum',
      caption: 'Ген/суб',
      editable: true,
      width: 200,
      lookup: {
        handbook: handbooks.value.genwork,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    }
  ])

  return { commentStatusCalendarPlan }
}
