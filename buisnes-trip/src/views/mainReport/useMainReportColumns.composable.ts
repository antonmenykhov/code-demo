import type { Column, ColumnType } from '@tnnc/tnnc-ui-kit/dist/interfaces/column.interface'
import { computed, ref, type Ref } from 'vue'
import { formatNumberValue } from '@/hooks/format.hook'
import { months } from '@/hooks/months'
import type { Version } from '@/interfaces/version.interface'
import type { DeviationItem } from './ReportView.vue'

export default function useMainReportColumns(
  versionsForCompare: Ref<Version[]>,
  devitaionVersions: Ref<DeviationItem[]>
) {
  const columnGroups = ['План', 'Прогноз', 'Отклонение']
  const selectedColumnGroups = ref(['План', 'Прогноз', 'Отклонение'])

  const monthsHandbook = computed(() => months.map((month, index) => ({ id: index, name: month })))
  const selectedMonths = ref([])
  const treeColumns = computed(() => {
    const columns: Column[] = [
      {
        name: 'number',
        caption: '№ п/п',
        columnType: 'string'
      },
      {
        name: 'state',
        caption: 'Статус',
        columnType: 'string'
      },
      {
        name: 'f_s_block',
        caption: 'Блок',
        columnType: 'string'
      },
      {
        name: 'department_name',
        caption: 'Наименование СП',
        columnType: 'string'
      },
      {
        name: 'mvz_code',
        caption: 'МВЗ',
        columnType: 'string'
      },
      {
        name: 'mvz_name',
        caption: 'Наименование МВЗ',
        columnType: 'string'
      },
      {
        name: 'goal_name',
        caption: 'Цель командировки',
        columnType: 'string'
      },
      {
        name: 'trip_type_name',
        caption: 'Тип командировки',
        columnType: 'string'
      },
      {
        name: 'budget_code',
        caption: 'Статья бюджета',
        columnType: 'string'
      },
      {
        name: 'city_name',
        caption: 'Город',
        columnType: 'string'
      }
    ]

    function getComputingColumnForVersionDeviation(devItem: DeviationItem, name: string): Column {
      return {
        caption: devItem.name,
        columnType: 'computed',
        name: `${name}_${devItem.firstVersion.id}_${devItem.secondVersion.id}`,
        cssClass: 'text-right',
        computing: {
          value(rowData, column, formatEd, formatRazryad) {
            return formatNumberValue(
              Number(rowData[`${name}_${devItem.firstVersion.id}`] || 0) -
                Number(rowData[`${name}_${devItem.secondVersion.id}`] || 0),
              formatEd,
              formatRazryad
            )
          }
        }
      }
    }

    function getColumnForVersionCompare(
      version: Version,
      name: string,
      type: ColumnType = 'number'
    ): Column {
      return {
        columnType: type,
        caption: version.name,
        name: `${name}_${version.id}`,
        cssClass: type === 'computed' ? 'text-right' : undefined,
        computing:
          type === 'computed'
            ? {
                value(rowData, column, formatEd, formatRazryad) {
                  return formatNumberValue(+rowData[column.name] || 0, formatEd, formatRazryad)
                }
              }
            : undefined
      }
    }

    function getColumnsForVersionCompareAndDeviation(
      name: string,
      type: ColumnType = 'number'
    ): Column[] {
      return [
        ...versionsForCompare.value.map<Column>((version) =>
          getColumnForVersionCompare(version, name, type)
        ),
        ...devitaionVersions.value.map((item) => getComputingColumnForVersionDeviation(item, name))
      ]
    }

    function generateTripSpending() {
      const column: Column = {
        name: 'trip_spending',
        caption: 'Расходы на командировки',
        columnType: 'joined',
        child: [
          {
            name: `growing_total`,
            caption: `Нарастающий итог (${selectedMonths.value
              .sort((a, b) => a - b)
              .map((index) => months[index])
              .join(', ')})`,
            columnType: 'joined',
            rendered: selectedMonths.value.length > 0,
            child: versionsForCompare.value.map((version) => ({
              name: `exp_year_plan_price_growing_total_${version.id}`,
              caption: version.name,
              columnType: 'computed',
              rendered: selectedMonths.value.length > 0,
              cssClass: 'text-right',
              computing: {
                value(rowData, column, formatEd, formatRazryad) {
                  return formatNumberValue(
                    selectedMonths.value.reduce((acc, index) => {
                      return (acc += rowData[`exp_plan_price_${index + 1}_${version.id}`] || 0)
                    }, 0),
                    formatEd,
                    formatRazryad
                  )
                }
              }
            }))
          },
          {
            name: `total`,
            caption: `Всего`,
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation('exp_year_plan_price_total')
          }
        ]
      }
      //цикл по кварталам
      for (let i = 0; i < 4; i++) {
        //цикл по месяцам в квартале
        for (let j = 0; j < 3; j++) {
          column.child?.push({
            name: `month${i * 3 + j}`,
            caption: months[i * 3 + j],
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation(
              `exp_plan_price_${i * 3 + j + 1}`,
              'computed'
            )
          })
        }
      }

      columns.push(column)
    }

    function generateTripCount() {
      const column: Column = {
        name: 'trip_count',
        caption: 'Количество командировок',
        columnType: 'joined',
        child: [
          {
            name: `count_total`,
            caption: 'Всего',
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation('cmd_plan_total', 'computed')
          }
        ]
      }
      months.forEach((month, index) => {
        column.child?.push({
          name: `count${index}`,
          caption: month,
          columnType: 'joined',
          child: getColumnsForVersionCompareAndDeviation(`cmd_plan_count_${index + 1}`, 'computed')
        })
      })
      columns.push(column)
    }

    function generateSpendingClassification() {
      const column: Column = {
        name: 'spendingClassification',
        caption: 'Классификация расходов',
        columnType: 'joined',
        child: [
          {
            name: 'transportSpending',
            caption: 'Проезд',
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation(`class_transportation_plan`)
          },
          {
            name: 'hotelSpending',
            caption: 'Проживание',
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation(`class_hotel_plan`)
          },
          {
            name: 'dpSpending',
            caption: 'Суточные',
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation(`class_dp_plan`)
          },
          {
            name: 'bookingSpending',
            caption: 'Услуги по бронированию',
            columnType: 'joined',
            child: getColumnsForVersionCompareAndDeviation(`class_booking_plan`)
          }
        ]
      }

      columns.push(column)
    }

    function generateNeeds() {
      const column: Column = {
        caption: 'Потребность',
        columnType: 'joined',
        name: 'needs',
        child: [
          {
            columnType: 'joined',
            name: 'peopleCount',
            caption: 'Кол-во командируемых',
            child: getColumnsForVersionCompareAndDeviation(`need_count_plan`, 'computed')
          },
          {
            columnType: 'joined',
            caption: 'Грейд',
            name: 'need_grade',
            child: versionsForCompare.value.map((version) => ({
              columnType: 'string',
              caption: version.name,
              name: `need_grade_${version.id}`
            }))
          },
          ...versionsForCompare.value.map<Column>((version) => ({
            columnType: 'joined',
            caption: `Даты ${version.name}`,
            name: `planDates_${version.id}`,
            child: [
              {
                name: `need_start_date_plan_${version.id}`,
                caption: 'Начало',
                columnType: 'date'
              },
              {
                name: `need_end_date_plan_${version.id}`,
                caption: 'Окончание',
                columnType: 'date'
              }
            ]
          })),
          {
            columnType: 'joined',
            caption: 'Продолжительность командировки для расчета расходов на проживание',
            name: 'hotelDuration',
            child: getColumnsForVersionCompareAndDeviation(`need_nights_count_plan`, 'computed')
          },
          {
            columnType: 'joined',
            caption: 'Цена гостиничного номера за 1 ночь',
            name: 'hotePrice',
            child: getColumnsForVersionCompareAndDeviation(`need_h_price_plan`).map((column) => ({
              ...column,
              excludeFromTotals: true
            }))
          },
          {
            columnType: 'joined',
            caption: 'Продолжительность командировки, включая дни дороги (за рубежом)',
            name: 'roadDurationOverseas',
            child: getColumnsForVersionCompareAndDeviation(
              `need_overseas_days_count_plan`,
              'computed'
            )
          },
          {
            columnType: 'joined',
            caption: 'Суточные (за рубежом) на 1-го сотрудника',
            name: 'roadPayOverseas',
            child: getColumnsForVersionCompareAndDeviation(`need_overseas_pay_plan`).map(
              (column) => ({
                ...column,
                excludeFromTotals: true
              })
            )
          },
          {
            columnType: 'joined',
            caption: 'Продолжительность командировки, включая дни дороги (по РФ)',
            name: 'roadDuration',
            child: getColumnsForVersionCompareAndDeviation(`need_total_days_count_plan`, 'computed')
          },
          {
            columnType: 'joined',
            caption: 'Суточные (по РФ) на 1-го сотрудника',
            name: 'roadPay',
            child: getColumnsForVersionCompareAndDeviation(`need_pay_plan`).map((column) => ({
              ...column,
              excludeFromTotals: true
            }))
          }
        ]
      }
      columns.push(column)
    }

    function generateTransportTypes() {
      const column: Column = {
        name: 'transportType',
        caption: 'Вид транспорта',
        columnType: 'joined',
        child: versionsForCompare.value.map((version) => ({
          name: `need_transport_plan_${version.id}`,
          caption: version.name,
          columnType: 'string'
        }))
      }

      columns.push(column)
    }

    function generateTransportPrices() {
      const column: Column = {
        name: 'transportPrice',
        caption: 'Цена билета (туда-обратно) на 1-го человека',
        columnType: 'joined',
        child: getColumnsForVersionCompareAndDeviation(`need_transport_price_plan`).map(
          (column) => ({
            ...column,
            excludeFromTotals: true
          })
        )
      }

      columns.push(column)
    }

    generateTripSpending()
    generateTripCount()
    generateSpendingClassification()
    generateNeeds()
    columns.push({
      name: 'comment',
      columnType: 'joined',
      caption: 'Комментарий',
      child: versionsForCompare.value.map((version) => ({
        columnType: 'string',
        caption: version.name,
        name: `comment_${version.id}`
      }))
    })
    generateTransportTypes()
    generateTransportPrices()

    columns.push({
      name: 'start_month_date',
      columnType: 'joined',
      caption: 'Месяц начала командировки',
      child: versionsForCompare.value.map((version) => ({
        columnType: 'string',
        caption: version.name,
        name: `start_month_date_${version.id}`
      }))
    })
    columns.push({
      name: 'end_month_date',
      columnType: 'joined',
      caption: 'Месяц окончания командировки',
      child: versionsForCompare.value.map((version) => ({
        columnType: 'string',
        caption: version.name,
        name: `end_month_date_${version.id}`
      }))
    })

    return columns
  })

  const plainColumns = computed(() => {
    const getColumnsPlain = (columns: Column[], parentCaption: string | undefined = undefined) => {
      const newColumnsArray: Column[] = []
      columns.forEach((column) => {
        const newColumn: Column = {
          ...column,
          caption: parentCaption ? `${parentCaption} ${column.caption}` : column.caption
        }
        if (newColumn.child?.length) {
          newColumnsArray.push(...getColumnsPlain(newColumn.child, newColumn.caption))
        } else {
          newColumnsArray.push(newColumn)
        }
      })
      return newColumnsArray
    }

    return getColumnsPlain(treeColumns.value)
  })

  const isColumnsPlain = ref(false)
  const computedColumns = computed(() =>
    isColumnsPlain.value ? plainColumns.value : treeColumns.value
  )

  return {
    computedColumns,
    monthsHandbook,
    selectedMonths,
    columnGroups,
    selectedColumnGroups,
    isColumnsPlain
  }
}
