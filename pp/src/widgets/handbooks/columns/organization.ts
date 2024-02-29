import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function organizationColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())

  const organization = computed<Column[]>(() => [
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'ksk',
      columnType: 'string',
      caption: 'Корпоративный код заказчика',
      editable: true,
      width: 250
    },
    {
      name: 'industrialBlockId',
      columnType: 'enum',
      caption: 'Производственный блок ТПР',
      editable: true,
      lookup: {
        handbook: handbooks.value.industrialBlock,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      width: 250
    },
    {
      name: 'industrialBlockPlanId',
      columnType: 'enum',
      caption: 'Производственный блок БП',
      editable: true,
      lookup: {
        handbook: handbooks.value.industrialBlock,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      width: 250
    },
    {
      name: 'perimetr',
      columnType: 'boolean',
      caption: 'Периметр ТПР',
      editable: true,
      trueValue: 'Да',
      falseValue: 'Нет',
      width: 100
    },
    {
      name: 'perimetrPlan',
      columnType: 'boolean',
      caption: 'Периметр БП',
      editable: true,
      trueValue: 'Да',
      falseValue: 'Нет',
      width: 100
    },
    {
      name: 'perimetrBDPS',
      columnType: 'boolean',
      caption: 'Периметр БДПС',
      editable: true,
      trueValue: 'Да',
      falseValue: 'Нет',
      width: 100
    }
  ])

  return { organization }
}
