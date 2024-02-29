import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'
import { monthHandbook } from '@/hooks/months'
import useTprIndexesTypes from '@/composables/useTprIndexesTypes.composable'

export default function useTprIndexesColumns() {
  const {
    forceTypes,
    choosedForceTypes,
    choosedIndexTypes,
    choosedMonths,
    monthHandbookExtended,
    indexTypes
  } = useTprIndexesTypes()

  const indexesColumns = computed(() => {
    const columns: Column<any, TprStandart>[] = []
    columns.push({
      name: 'indexMonthTotalE',
      columnType: 'joined',
      caption: 'Всего',
      meta: { month: 'total' },
      child: forceTypes.map<Column<any, TprStandart>>((force) => ({
        name: `monthTotal${force.name}`,
        columnType: 'joined',
        caption: force.caption,
        cssClass: force.cssClass,
        meta: { month: 'total', force: force.name },
        child: indexTypes
          .map<Column<any, TprStandart>>((type) => ({
            name: `${force.name}E${type.name}`,
            cssClass: force.cssClass,
            columnType: 'number',
            caption: type.caption,
            meta: { month: 'total', force: force.name, type: type.name }
          }))
          .filter((column) => {
            if (column.meta?.force === 'own' && column.meta?.type === 'planCp_None') return false
            return true
          })
      }))
    })
    monthHandbook.forEach((monthItem) => {
      columns.push({
        name: 'indexMonth' + monthItem.id,
        columnType: 'joined',
        caption: monthItem.name,
        meta: { month: `${monthItem.id}` },
        child: forceTypes.map<Column<any, TprStandart>>((force) => ({
          name: `monthTotal${force.name}${monthItem.id}`,
          columnType: 'joined',
          caption: force.caption,
          cssClass: force.cssClass,
          meta: { month: `${monthItem.id}`, force: force.name },
          child: indexTypes
            .map<Column<any, TprStandart>>((type) => ({
              name: `${force.name}_mounth${monthItem.id}_${type.name}`,
              cssClass: force.cssClass,
              columnType: 'number',
              caption: type.caption,
              editable:
                force.name !== 'own' &&
                (type.name === 'factPrice_Stage' ||
                  type.name === 'price_Stage' ||
                  type.name === 'correction_Stage'),
              meta: {
                crud_group: type.name.includes('Stage') ? 'Stage' : 'ContractPlan',
                month: `${monthItem.id}`,
                force: force.name,
                type: type.name
              }
            }))
            .filter((column) => {
              if (column.meta?.force === 'own' && column.meta?.type === 'planCp_None') return false
              return true
            })
        }))
      })
    })
    columns.push({
      name: 'growingTotal',
      columnType: 'joined',
      caption: 'Нарастающий итог',
      child: [
        {
          name: 'contractAccum_Acm',
          columnType: 'number',
          caption: 'План по КП '
        },
        {
          name: 'prognosAccum_Acm',
          columnType: 'number',
          caption: 'Прогноз'
        },
        {
          name: 'diffContractAccum_Acm',
          columnType: 'number',
          caption: 'Отклонение'
        }
      ]
    })
    columns.push({
      name: 'deviationContract_CommentBlock',
      columnType: 'string',
      caption: 'Причина отклонения факта/ожида от КП по договорам',
      editable: true,
      meta: { crud_group: 'CommentBlock' }
    })
    return columns
  })

  return {
    indexesColumns,
    forceTypes,
    indexTypes,
    choosedForceTypes,
    choosedIndexTypes,
    monthHandbookExtended,
    choosedMonths
  }
}
