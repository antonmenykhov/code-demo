import type { TprHandbookExtended } from '@/widgets/handbooks/composables/useHandbooks.composable'
import { getFormateValue, type Column } from 'tnnc-ui-kit'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import type { Nds } from '@/interfaces/supp-entities/nds.interface'
import { computed, type Ref } from 'vue'
import useTprIndexesColumns from './indexesColumns'
import { calcTotalGenSub } from './total-function'
import type { TableTotal } from 'tnnc-ui-kit/dist/interfaces/table-props.interface'
import type { CustomManageButton } from 'tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'

export default function tprColumns(
  handbooks: Ref<TprHandbookExtended>,
  isFullTprShowed: Ref<boolean>,
  errors: Ref<TprError[]>
) {
  const {
    indexesColumns,
    choosedForceTypes,
    choosedIndexTypes,
    forceTypes,
    indexTypes,
    monthHandbookExtended,
    choosedMonths
  } = useTprIndexesColumns()
  const columns = computed(() => {
    const columns: Column<any, TprStandart, TprStandart, { growingRange: number[] }>[] = [
      {
        name: 'ID',
        columnType: 'number',
        caption: '№ п/п',
        width: 70,
        excludeFromTotals: true
      },
      {
        name: 'outside_None',
        columnType: 'boolean',
        caption: 'Сторонние/Группа для Формуляра ',
        trueValue: 'Группа/Корпоративные НИПИ',
        falseValue: 'Сторонние'
      },
      {
        name: 'customer_Staff_Project',
        columnType: 'enum',
        caption: 'Контрагент',
        editable: true,
        meta: { crud_group: 'Staff_Project' }
      },
      {
        name: 'techCustomer_Staff_Project',
        columnType: 'enum',
        caption: 'Технический заказчик',
        editable: true,
        meta: { crud_group: 'Staff_Project' }
      },

      {
        name: 'numberContract_None',
        columnType: 'string',
        caption: 'Номер договора',
        editable: true,
        width: 150,
        meta: { crud_group: 'CalendarPlan' }
      },
      {
        name: 'name_CalendarPlan',
        columnType: 'string',
        caption: 'Наименование работ',
        editable: true,
        width: 200,
        meta: { crud_group: 'CalendarPlan' }
      },
      {
        name: 'parentContract_None',
        columnType: 'string',
        caption: 'Номер родительского договора',
        editable: false,
        width: 200
      },
      {
        name: 'connection.mainNumber',
        columnType: 'string',
        caption: 'Номер основного договора',
        editable: false,
        width: 150,
        meta: { crud_group: 'CalendarPlan' },
        nestedValue: true
      },
      {
        name: 'connection.mainName',
        columnType: 'string',
        caption: 'Наименование основного договора',
        editable: false,
        width: 200,
        meta: { crud_group: 'CalendarPlan' },
        nestedValue: true
      },

      {
        name: 'internalOrder_CalendarPlan',
        columnType: 'string',
        caption: 'Внутренние заказы',
        editable: true,
        meta: { crud_group: 'CalendarPlan' }
      },

      {
        name: 'contractsDates',
        columnType: 'joined',
        caption: 'Дата заключения договора',
        child: [
          {
            name: 'dateConclusionContractPlan_CalendarPlan',
            columnType: 'date',
            caption: 'План ',
            editable: true,
            meta: { crud_group: 'CalendarPlan' }
          },
          {
            name: 'dateConclusionContractFact_CalendarPlan',
            columnType: 'date',
            caption: 'Факт ',
            editable: true,
            meta: { crud_group: 'CalendarPlan' }
          }
        ]
      },
      {
        name: 'contractsPeriod',
        columnType: 'joined',
        caption: 'Срок действия договора',
        editable: true,
        child: [
          {
            name: 'start_CalendarPlan',
            columnType: 'date',
            caption: 'Начало работ по договору',
            editable: true,
            meta: { crud_group: 'CalendarPlan' }
          },
          {
            name: 'finish_CalendarPlan',
            columnType: 'date',
            caption: 'Окончание работ по договору',
            editable: true,
            meta: { crud_group: 'CalendarPlan' }
          }
        ]
      },
      {
        name: 'statusCalendarPlan_None',
        columnType: 'enum',
        caption: 'Статус договора',
        editable: true,
        meta: { crud_group: 'CalendarPlan' }
      },
      {
        name: 'status_CommentBlock',
        columnType: 'string',
        caption: 'Комментарии к статусу заключения договора',
        editable: true,
        meta: { crud_group: 'CommentBlock' }
      },
      {
        name: 'genwork_CalendarPlan',
        columnType: 'boolean',
        caption: 'Ген/Суб',
        trueValue: 'Генподряд',
        falseValue: 'Субподряд',
        defaultValue: true,
        meta: { crud_group: 'CalendarPlan' }
      },
      {
        name: 'department_Staff_Project',
        columnType: 'enum',
        caption: 'Управление',
        editable: true,
        meta: { crud_group: 'Staff_Project' }
      },
      {
        name: 'curator_None',
        columnType: 'string',
        caption: 'Куратор'
      },
      {
        name: 'kindWork_Business_Project',
        columnType: 'enum',
        caption: 'Вид работ',
        editable: true,
        meta: { crud_group: 'Business_Project' }
      },
      {
        name: 'directWork_Business_Project',
        columnType: 'enum',
        caption: 'Направление работ',
        editable: true,
        meta: { crud_group: 'Business_Project' }
      },
      {
        name: 'okved_None',
        columnType: 'string',
        caption: 'ОКВЭД'
      },
      {
        name: 'risk_CalendarPlan',
        columnType: 'boolean',
        caption: 'Риск',
        trueValue: 'Да',
        falseValue: 'Нет',
        editable: true,
        meta: { crud_group: 'CalendarPlan' }
      },

      <Column<Nds, TprStandart>>{
        name: 'nds_None',
        columnType: 'enum',
        caption: 'НДС',
        editable: true,
        lookup: {
          handbook: handbooks.value.nds,
          displayExpr: 'textName',
          valueExpr: 'name',
          idExpr: 'name'
        },
        meta: { crud_group: 'CalendarPlan' }
      },

      {
        name: 'totalContract_CalendarPlan',
        columnType: 'number',
        caption: 'Всего по договору',
        editable: true,
        meta: { crud_group: 'CalendarPlan' }
      },
      {
        name: 'opex_CalendarPlan',
        columnType: 'boolean',
        caption: 'OPEX/CAPEX',
        editable: true,
        trueValue: 'OPEX',
        falseValue: 'CAPEX',
        meta: { crud_group: 'CalendarPlan' }
      },
      {
        name: 'rate_CommentBlock',
        columnType: 'string',
        caption: 'Ставка',
        editable: true,
        meta: { crud_group: 'CommentBlock' }
      },
      {
        name: 'general_CommentBlock',
        columnType: 'string',
        caption: 'Комментарии',
        editable: true,
        meta: { crud_group: 'CommentBlock' }
      },
      ...indexesColumns.value,
      {
        name: 'growingTotalBp',
        columnType: 'joined',
        caption: 'Нарастающий итог',
        child: [
          {
            name: 'growingTotalBpBp',
            cssClass: 'index-color-dark-blue ',
            columnType: 'joined',
            caption: 'БП (без начисл.выр)',

            child: [
              {
                name: 'genPlanAccum_Acm',
                cssClass: 'index-color-blue',
                columnType: 'number',
                caption: 'Генподряд '
                //   computing: {
                //     value(rowData, column, formatEd, formatRazryad, meta) {
                //       return getFormateValue(
                //         calcTotalBPRangeGen(rowData, meta?.growingRange || [1, 12]),
                //         formatEd,
                //         formatRazryad
                //       )
                //     }
                //   }
              },
              {
                name: 'ownPlanAccum_Acm',
                cssClass: 'index-color-orange',
                columnType: 'number',
                caption: 'Соб.силы '
                //  computing: {
                //    value(rowData, column, formatEd, formatRazryad, meta) {
                //      return getFormateValue(
                //        calcTotalBPRangeSS(rowData, meta?.growingRange || [1, 12]),
                //        formatEd,
                //        formatRazryad
                //      )
                //    }
                //  }
              },
              {
                name: 'subPlanAccum_Acm',
                cssClass: 'index-color-green ',
                columnType: 'number',
                caption: 'Субподряд '
                //    computing: {
                //      value(rowData, column, formatEd, formatRazryad, meta) {
                //        return getFormateValue(
                //          calcTotalBPRangeSub(rowData, meta?.growingRange || [1, 12]),
                //          formatEd,
                //          formatRazryad
                //        )
                //      }
                //    }
              }
            ]
          },
          {
            name: 'growingTotalBpFactPlan',
            cssClass: 'index-color-dark-blue ',
            columnType: 'joined',
            caption: 'Факт/текущий прогноз',

            child: [
              {
                name: 'genPrognosAccum_Acm',
                cssClass: 'index-color-blue',
                columnType: 'number',
                caption: 'Генподряд '
                //  computing: {
                //    value(rowData, column, formatEd, formatRazryad, meta) {
                //      return getFormateValue(
                //        calcTotalPrognozRangeGen(rowData, meta?.growingRange || [1, 12]),
                //        formatEd,
                //        formatRazryad
                //      )
                //    }
                //  }
              },
              {
                name: 'ownPrognosAccum_Acm',
                cssClass: 'index-color-orange',
                columnType: 'number',
                caption: 'Соб.силы'
                //  computing: {
                //    value(rowData, column, formatEd, formatRazryad, meta) {
                //      return getFormateValue(
                //        calcTotalPrognozRangeSS(rowData, meta?.growingRange || [1, 12]),
                //        formatEd,
                //        formatRazryad
                //      )
                //    }
                //  }
              },
              {
                name: 'subPrognosAccum_Acm',
                cssClass: 'index-color-green ',
                columnType: 'number',
                caption: 'Субподряд '
                // computing: {
                //   value(rowData, column, formatEd, formatRazryad, meta) {
                //     return getFormateValue(
                //       calcTotalPrognozRangeSub(rowData, meta?.growingRange || [1, 12]),
                //       formatEd,
                //       formatRazryad
                //     )
                //   }
                // }
              }
            ]
          },
          {
            name: 'growingTotalBpDiff',
            cssClass: 'index-color-dark-blue ',
            columnType: 'joined',
            caption: 'Разница ФАКТ/БП',

            child: [
              {
                name: 'genDiffPlanAccum_Acm',
                cssClass: 'index-color-blue',
                columnType: 'number',
                caption: 'Генподряд '
                //  computing: {
                //    value(rowData, column, formatEd, formatRazryad, meta) {
                //      return getFormateValue(
                //        calcTotalDiffProgBPGen(rowData, meta?.growingRange || [1, 12]),
                //        formatEd,
                //        formatRazryad
                //      )
                //    }
                //  }
              },
              {
                name: 'ownDiffPlanAccum_Acm',
                cssClass: 'index-color-orange',
                columnType: 'number',
                caption: 'Соб.силы '
                // computing: {
                //   value(rowData, column, formatEd, formatRazryad, meta) {
                //     return getFormateValue(
                //       calcTotalDiffProgBPSS(rowData, meta?.growingRange || [1, 12]),
                //       formatEd,
                //       formatRazryad
                //     )
                //   }
                // }
              },
              {
                name: 'subDiffPlanAccum_Acm',
                cssClass: 'index-color-green ',
                columnType: 'number',
                caption: 'Субподряд '
                //  computing: {
                //    value(rowData, column, formatEd, formatRazryad, meta) {
                //      return getFormateValue(
                //        calcTotalDiffProgBPSub(rowData, meta?.growingRange || [1, 12]),
                //        formatEd,
                //        formatRazryad
                //      )
                //    }
                //  }
              }
            ]
          }
        ]
      },
      {
        name: 'deviationPlan_CommentBlock',
        columnType: 'string',
        caption: 'Причина отклонения факта/ожида от БП (без начисленной выручки) за отчет.период',
        editable: true,
        meta: { crud_group: 'CommentBlock' }
      },
      {
        name: 'diffTotalFactor',
        cssClass: 'index-color-blue',
        columnType: 'joined',
        caption: 'Изменение общей выручки от БП (без начисленной выручки) за счет факторов',
        child: [
          {
            name: 'generalDeviation_None',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Отклонение ВСЕГО, тыс. руб. без НДС'
          },
          {
            name: 'discountEconomySelf_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Скидка Заказчикам за счет экономии собственных средств',
            editable: true,
            meta: { crud_group: 'GeneralForcesFactor' }
          },
          {
            name: 'cancellWork_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Отмена объемов работ по инициативе Заказчика',
            editable: true,
            meta: { crud_group: 'GeneralForcesFactor' }
          },
          {
            name: 'transferWork_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Перенос на следующий год объемов работ по инициативе Заказчика',
            editable: true,

            meta: { crud_group: 'GeneralForcesFactor' }
          },
          {
            name: 'revisionWork_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Уточнение состава/ объемов работ / Доп.объемы работ по инициативе Заказчика',
            editable: true,

            meta: { crud_group: 'GeneralForcesFactor' }
          },
          {
            name: 'closeCosts_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Закрытие по факт. Затратам',
            editable: true,

            meta: { crud_group: 'GeneralForcesFactor' }
          },
          {
            name: 'reduceTender_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'Снижение стоимости работ за счет тендеров по с/п',
            editable: true,

            meta: { crud_group: 'GeneralForcesFactor' }
          },
          {
            name: 'operationKNIPI_GeneralForcesFactor',
            cssClass: 'index-color-blue',
            columnType: 'number',
            caption: 'По результатам деятельности КНИПИ',
            editable: true,

            meta: { crud_group: 'GeneralForcesFactor' }
          }
        ]
      },
      {
        name: 'comments_GeneralForcesFactor',
        cssClass: 'index-color-blue',
        columnType: 'string',
        caption: 'Комментарии по изменению общей выручки от БП (без начисленной выручки)',
        editable: true,
        meta: { crud_group: 'GeneralForcesFactor' }
      },
      {
        name: 'diffTotalFactorSS',
        cssClass: 'index-color-orange',
        columnType: 'joined',
        caption: 'Изменение собств. сил/субподряда  за счет факторов',
        child: [
          {
            name: 'ownDeviation_None',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'Отклонение ВСЕГО, тыс. руб. без НДС'
          },
          {
            name: 'discountEconomySelf_OwnForcesFactor',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'Скидка Заказчикам за счет экономии собственных средств',
            editable: true,
            meta: { crud_group: 'OwnForcesFactor' }
          },
          {
            name: 'cancellWork_OwnForcesFactor',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'Отмена объемов работ по инициативе Заказчика',
            editable: true,
            meta: { crud_group: 'OwnForcesFactor' }
          },
          {
            name: 'transferWork_OwnForcesFactor',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'Перенос на следующий год объемов работ по инициативе Заказчика',
            editable: true,
            meta: { crud_group: 'OwnForcesFactor' }
          },
          {
            name: 'revisionWork_OwnForcesFactor',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'Уточнение состава/ объемов работ / Доп.объемы работ по инициативе Заказчика',
            editable: true,
            meta: { crud_group: 'OwnForcesFactor' }
          },
          {
            name: 'moveSelf_OwnForcesFactor',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'Отмена с/п, выполнение их с/с',
            editable: true,
            meta: { crud_group: 'OwnForcesFactor' }
          },
          {
            name: 'operationKNIPI_OwnForcesFactor',
            cssClass: 'index-color-orange',
            columnType: 'number',
            caption: 'По результатам деятельности КНИПИ',
            editable: true,
            meta: { crud_group: 'OwnForcesFactor' }
          }
        ]
      },
      {
        name: 'comments_OwnForcesFactor',
        cssClass: 'index-color-orange',
        columnType: 'string',
        caption: 'Комментарии по изменению собств. сил от БП (без начисленной выручки)',
        editable: true,
        meta: { crud_group: 'OwnForcesFactor' }
      },
      {
        name: 'techCustomerDepartment_Staff_Project',
        columnType: 'enum',
        caption: 'Подразделения для Заказчика «НК «Роснефть»',
        editable: true,
        meta: { crud_group: 'Staff_Project' }
      },
      {
        name: 'cIP_GhostCalendarPlan',
        columnType: 'number',
        caption: 'ЦИП',
        editable: true,
        meta: { crud_group: 'GhostCalendarPlan' }
      },
      {
        name: 'timeConstraints_GhostCalendarPlan',
        columnType: 'date',
        caption: 'Срок окончания работ',
        editable: true,
        meta: { crud_group: 'GhostCalendarPlan' }
      },
      {
        name: 'monitoringUnplannedWork_GhostCalendarPlan',
        columnType: 'enum',
        caption: 'Мониторинг внеплановых объемов для ГИРов',
        editable: true,
        meta: { crud_group: 'GhostCalendarPlan' },
        lookup: {
          handbook: handbooks.value.months,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'uniqueIdNumberOfYear_NumberCalendarPlanOfYear',
        columnType: 'computedText',
        caption: 'Уникальный идентификационный номер',
        meta: { crud_group: 'NumberCalendarPlanOfYear' },
        computing: {
          value(rowData) {
            return `ТННЦ-${rowData.uniqueIdNumberOfYear_NumberCalendarPlanOfYear}`
          }
        }
      },
      {
        name: 'formatGeneralContractOutsideCustomer_None',
        columnType: 'enum',
        caption: 'Формат заключения генподрядного договора со сторонним заказчиком',
        editable: true,
        meta: { crud_group: 'GhostCalendarPlan' }
      },
      {
        name: 'scopeWorkSubcontract_None',
        columnType: 'enum',
        caption: 'Объем работ договора, передаваемых на субподряд работ',
        editable: true,
        meta: { crud_group: 'GhostCalendarPlan' }
      },
      {
        name: 'reasonWorkSubcontract_None',
        cssClass: ' ',
        columnType: 'enum',
        caption: 'Причины передачи объемов работ для выполнения на субподряд в текущем году',
        editable: true,
        meta: { crud_group: 'GhostCalendarPlan' }
      },
      {
        name: 'note_CommentBlock',
        columnType: 'string',
        caption: 'Примечание',
        editable: true,
        meta: { crud_group: 'CommentBlock' }
      },
      {
        name: 'numberContractId_CalendarPlan',
        columnType: 'number',
        caption: 'ID Номера договора',
        rendered: false,
        width: 0,
        meta: { crud_group: 'CalendarPlan' },
        excludeFromColumnChooser: true
      },
      {
        name: 'parentId_CalendarPlan',
        columnType: 'number',
        caption: 'ID генподряда',
        rendered: false,
        width: 0,
        meta: { crud_group: 'CalendarPlan' },
        excludeFromColumnChooser: true
      }
    ]

    return columns
  })
  const columnsWithCustomGroupingMethod = computed(() =>
    columns.value.map((column) => ({
      ...column,
      computing: { ...column.computing, grouping: calcTotalGenSub }
    }))
  )
  const columnsSliced = computed(() =>
    isFullTprShowed.value
      ? columnsWithCustomGroupingMethod.value
      : columnsWithCustomGroupingMethod.value
          .slice(0, 20)
          .filter(
            (column) =>
              column.name !== 'connection.mainName' &&
              column.name !== 'connection.mainNumber' &&
              column.name !== 'okved_None' &&
              column.name !== 'parentContract_None'
          )
  )
  const totals: TableTotal<TprStandart, TprStandart>[] = [
    {
      name: 'Итого',
      function(column, rows, ed, razryd) {
        return getFormateValue(calcTotalGenSub(rows, column), 1, razryd)
      }
    }
  ]

  const buttons: CustomManageButton[] = [
    {
      fn() {},
      title: 'Есть ошибки!',
      icon: 'fa-solid fa-triangle-exclamation red-icon',
      condition: (row) => (errors.value.find((error) => error.ID === row._rawRow.ID) ? true : false)
    },
    {
      fn() {},
      title: 'Ошибок нет',
      icon: 'fa-solid fa-check green-icon',
      condition: (row) =>
        !errors.value.find((error) => error.ID === row._rawRow.ID) ? true : false
    }
  ]
  return {
    columns,
    choosedForceTypes,
    choosedIndexTypes,
    forceTypes,
    indexTypes,
    monthHandbookExtended,
    choosedMonths,
    columnsWithCustomGroupingMethod,
    columnsSliced,
    totals,
    buttons
  }
}
