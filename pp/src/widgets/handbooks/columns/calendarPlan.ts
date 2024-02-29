import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'
export default function CalendarPlanColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const calendarPlan = computed<Column[]>(() => [
    {
      name: 'id',
      columnType: 'string',
      caption: '№ п/п',
      editable: false,
      width: 80
    },
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'numberContractId',
      columnType: 'enum',
      caption: 'Номер договора',
      editable: false,
      lookup: {
        handbook: handbooks.value.numberContract,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      width: 200
    },
    {
      name: 'start',
      columnType: 'date',
      caption: 'Дата начала',
      editable: true,
      width: 100
    },
    {
      name: 'finish',
      columnType: 'date',
      caption: 'Дата окончания',
      editable: true,
      width: 100
    },
    {
      name: 'dateConclusionContractPlan',
      columnType: 'date',
      caption: 'Дата заключения план',
      editable: true,
      width: 100
    },
    {
      name: 'dateConclusionContractFact',
      columnType: 'date',
      caption: 'Дата заключения факт',
      editable: true,
      width: 100
    },
    {
      name: 'statusCalendarPlanId',
      columnType: 'enum',
      caption: 'Статус',
      editable: true,
      width: 100,
      lookup: {
        handbook: handbooks.value.statusCalendarPlan,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },
    {
      name: 'totalContract',
      columnType: 'number',
      caption: 'Всего по договору',
      editable: true,
      width: 100
    },
    {
      name: 'genwork',
      columnType: 'boolean',
      caption: 'Ген/суб',
      editable: true,
      trueValue: 'Генподряд',
      falseValue: 'Субподряд',
      width: 100
    }
  ])

  return { calendarPlan }
}
