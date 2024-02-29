import type { Column } from '@tnnc/tnnc-ui-kit'
import { computed, markRaw, type ComputedRef } from 'vue'
import { handbooksStore } from '@/store/hanbooks.store'
import type { TripGoal } from '@/interfaces/trip-goal.interface'
import type { Limit } from '@/interfaces/limit.interface'
import type { LimitDivision } from '@/interfaces/limit-division.interface'
import LimitSumCell from '@/components/LimitSumCell.vue'
import type { VersionStatus } from '@/interfaces/version-status.interface'
import FinStructureServiceStaffCell from '@/components/FinStructureServiceStaffCell.vue'

export default function useHandbooksColumns() {
  const handbook = handbooksStore()
  const cities_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'name',
        columnType: 'string',
        editable: true,
        caption: 'Название'
      },
      {
        name: 'is_overseas',
        columnType: 'boolean',
        editable: true,
        caption: 'Зарубежный',
        trueValue: 'Да',
        falseValue: 'Нет',
        defaultValue: false
      }
    ]
    return columns
  })

  const daily_payment_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'city_id',
        columnType: 'enum',
        editable: true,
        caption: 'Город',
        lookup: {
          handbook: handbook.handbooks.cities,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'plan_price',
        columnType: 'number',
        editable: true,
        caption: 'Цена'
      }
    ]
    return columns
  })

  const grades_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'name',
        columnType: 'string',
        editable: true,
        caption: 'Название'
      }
    ]
    return columns
  })

  const hotels_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'city_id',
        columnType: 'enum',
        editable: true,
        caption: 'Город',
        lookup: {
          handbook: handbook.handbooks.cities,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'grade_id',
        columnType: 'enum',
        editable: true,
        caption: 'Грейд',
        lookup: {
          handbook: handbook.handbooks.grades,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'plan_price',
        columnType: 'number',
        editable: true,
        caption: 'Цена'
      }
    ]
    return columns
  })

  const states_columns = computed(() => grades_columns.value)

  const planning_periods_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'year',
        caption: 'Год',
        editable: true,
        columnType: 'string'
      },
      {
        name: 'month',
        caption: 'Месяц',
        editable: true,
        columnType: 'string'
      },
      {
        name: 'plan_state_id',
        columnType: 'enum',
        editable: true,
        caption: 'План статус',
        lookup: {
          handbook: handbook.handbooks.states,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      //   {
      //     name: 'prog_state_id',
      //     columnType: 'enum',
      //     editable: true,
      //     caption: 'Прогноз статус',
      //     lookup: {
      //       handbook: handbook.handbooks.states,
      //       displayExpr: 'name',
      //       valueExpr: 'id',
      //       idExpr: 'id'
      //     }
      //   },
      {
        name: 'fact_state_id',
        columnType: 'enum',
        editable: true,
        caption: 'Факт статус',
        lookup: {
          handbook: handbook.handbooks.states,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      }
    ]
    return columns
  })

  const train_tickets_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'city_id',
        columnType: 'enum',
        editable: true,
        caption: 'Город',
        lookup: {
          handbook: handbook.handbooks.cities,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'grade_id',
        columnType: 'enum',
        editable: true,
        caption: 'Грейд',
        lookup: {
          handbook: handbook.handbooks.grades,
          displayExpr: 'name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'plan_price',
        columnType: 'number',
        caption: 'Цена',
        editable: true
      }
    ]
    return columns
  })

  const plane_tickets_columns = computed(() => train_tickets_columns.value)

  const trip_purposes_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'trip_type_id',
        caption: 'Тип командировки',
        editable: true,
        columnType: 'enum',
        lookup: {
          handbook: handbook.handbooks.trip_types,
          displayExpr: 'trip_type_name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'trip_goal_id',
        caption: 'Цель командировки',
        editable: true,
        columnType: 'enum',
        lookup: {
          handbook: handbook.handbooks.trip_goals,
          displayExpr: 'goal_name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      //  {
      //    name: 'budget_code.budget_code',
      //    caption: 'Код статьи бюджета',
      //    columnType: 'string',
      //    cssClass: 'text-center'
      //  },
      {
        name: 'budget_code_id',
        caption: 'Наименование статьи бюджета',
        editable: true,
        columnType: 'enum',
        lookup: {
          handbook: handbook.handbooks.budget_codes,
          displayExpr: 'budget_name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      //    {
      //      name: 'account.account_code',
      //      caption: 'Код счета учета',
      //      columnType: 'string',
      //      cssClass: 'text-center'
      //    },
      //    {
      //      name: 'account_id',
      //      caption: 'Счет учета',
      //      editable: true,
      //      columnType: 'enum',
      //      lookup: {
      //        handbook: handbook.handbooks.accounts,
      //        displayExpr: 'account_name',
      //        valueExpr: 'id',
      //        idExpr: 'id'
      //      }
      //    },
      {
        name: 'is_plan',
        caption: 'Признак отношения к плановым/прогнозным данным',
        columnType: 'boolean',
        editable: true,
        trueValue: 'Плановые',
        falseValue: 'Не плановые'
      }
    ]
    return columns
  })

  const budget_codes_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'budget_code',
        caption: 'Код',
        columnType: 'string',
        editable: true
      },
      {
        name: 'budget_name',
        caption: 'Наименование',
        columnType: 'string',
        editable: true
      }
    ]
    return columns
  })

  const trip_types_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'trip_type_name',
        caption: 'Наименование',
        columnType: 'string',
        editable: true
      }
    ]
    return columns
  })

  const trip_goals_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'goal_name',
        caption: 'Наименование',
        columnType: 'string',
        editable: true
      }
    ]
    return columns
  })

  const fin_structures_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'block',
        caption: 'Блок',
        columnType: 'string',
        editable: true
      },
      {
        name: 'code',
        caption: 'Код',
        columnType: 'string',
        editable: true
      },
      {
        name: 'department_name',
        caption: 'Подразделение',
        columnType: 'string',
        editable: true
      },
      {
        name: 'department_name_sr',
        caption: 'Подразделение ШР',
        columnType: 'string',
        editable: true
      },
      {
        name: 'mvz_code',
        caption: 'Код МВЗ',
        columnType: 'string',
        editable: true
      },
      {
        name: 'mvz_name',
        caption: 'Наименование МВЗ',
        columnType: 'string',
        editable: true
      },
      {
        name: 'mvz_type',
        caption: 'Тип МВЗ',
        columnType: 'string',
        editable: true
      },
      {
        name: 'department_ids_sr',
        caption: 'Сервис "Штатное расписание"',
        columnType: 'computedText',
        editable: true,
        //@ts-ignore
        defaultValue: [],
        computing: {
          value(rowData, column) {
            return (
              rowData[column.name]
                ?.map(
                  (depId: string) =>
                    handbook.departments.find((dep) => dep.id === depId)?.name ||
                    handbook.directorsOfDepartment.find(
                      (director) => director.staffDepartmentId === depId
                    )?.nameStaff ||
                    'Не найден в ШР'
                )
                .join(', ') || '(Пусто)'
            )
          }
        },
        templating: {
          editor: markRaw(FinStructureServiceStaffCell)
        }
      }
    ]
    return columns
  })

  const accounts_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'account_code',
        caption: 'Код',
        columnType: 'string',
        editable: true
      },
      {
        name: 'account_name',
        caption: 'Наименование',
        columnType: 'string',
        editable: true
      },
      {
        name: 'expense_type_id',
        caption: 'Классификация расходов',
        columnType: 'enum',
        editable: true,
        lookup: {
          handbook: handbook.handbooks.expense_types,
          displayExpr: 'expense_type_name',
          valueExpr: 'id',
          idExpr: 'id'
        }
      }
    ]

    return columns
  })

  const users_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'sr_id',
        caption: 'ФИО',
        columnType: 'enum',
        editable: true,
        lookup: {
          handbook: handbook.employees,
          displayExpr: 'fullFio',
          valueExpr: 'userId',
          idExpr: 'userId'
        }
      },
      {
        name: 'user_role_id',
        caption: 'Роль',
        columnType: 'enum',
        editable: true,
        lookup: {
          handbook: handbook.handbooks.user_roles,
          valueExpr: 'id',
          idExpr: 'id',
          displayExpr: 'user_role_name'
        }
      },
      {
        name: 'send_messages',
        caption: 'Включить в рассылку',
        columnType: 'boolean',
        trueValue: 'Да',
        falseValue: 'Нет',
        editable: true
      }
    ]
    return columns
  })

  const user_roles_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'user_role_name',
        caption: 'Наименование',
        columnType: 'string',
        editable: true
      }
    ]
    return columns
  })

  const user_access_columns = computed(() => {
    const columns: Column[] = [
      {
        name: 'user_id',
        caption: 'Пользователь',
        columnType: 'enum',
        editable: true,
        lookup: {
          handbook: handbook.handbooks.users,
          displayExpr: 'fio',
          valueExpr: 'id',
          idExpr: 'id'
        }
      },
      {
        name: 'fin_structure_id',
        caption: 'Фин. структура',
        columnType: 'enum',
        editable: true,
        lookup: {
          handbook: handbook.handbooks.fin_structures,
          displayExpr: 'department_name_sr',
          valueExpr: 'id',
          idExpr: 'id'
        }
      }
    ]
    return columns
  })

  const limits_columns = computed<Column<any, Limit>[]>(() => [
    <Column<TripGoal, Limit>>{
      name: 'trip_goal_id',
      columnType: 'enum',
      caption: 'Наименование цели командировки',
      width: 500,
      editable: true,
      lookup: {
        handbook: handbook.handbooks.trip_goals,
        displayExpr: 'goal_name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },
    {
      name: 'transport_percent',
      caption: 'Проезд',
      columnType: 'number',
      editable: true
    },
    {
      name: 'hotel_percent',
      caption: 'Проживание',
      columnType: 'number',
      editable: true
    },
    {
      name: 'daily_payment_percent',
      caption: 'Суточные',
      columnType: 'number',
      editable: true
    },
    {
      name: 'fullPercent',
      caption: 'Структура распределения лимитов, %',
      columnType: 'computed',
      computing: {
        value(rowData) {
          return `${
            rowData.transport_percent + rowData.daily_payment_percent + rowData.hotel_percent
          }`
        }
      },
      templating: {
        editor: LimitSumCell
      },
      validation: {
        func(rowData) {
          return {
            isValid:
              rowData.daily_payment_percent + rowData.hotel_percent + rowData.transport_percent ===
              100,
            message: 'Суммарное значение должно быть 100%'
          }
        }
      }
    },
    <Column<LimitDivision, Limit>>{
      name: 'limit_division_id',
      caption: 'Распределить в течении года',
      columnType: 'enum',
      editable: true,
      lookup: {
        handbook: handbook.handbooks.limit_divisions,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    }
  ])

  const version_statuss_columns = computed<Column[]>(() => [
    {
      name: 'name',
      caption: 'Наименование',
      columnType: 'string',
      editable: true
    }
  ])

  const versions_columns = computed<Column[]>(() => [
    {
      name: 'name',
      caption: 'Наименование',
      columnType: 'string',
      editable: true
    },
    <Column<VersionStatus>>{
      name: 'version_status_id',
      caption: 'Статус',
      columnType: 'enum',
      lookup: {
        handbook: handbook.handbooks.version_statuss,
        displayExpr: 'name',
        idExpr: 'id',
        valueExpr: 'id'
      },
      editable: true
    },
    {
      name: 'comment',
      caption: 'Комментарий',
      columnType: 'string',
      editable: true
    },
    {
      name: 'date_end',
      caption: 'Дата окончания',
      columnType: 'date',
      editable: true
    }
  ])

  const expense_types_columns = computed<Column[]>(() => [
    {
      name: 'expense_type_name',
      caption: 'Классификация расходов',
      columnType: 'string',
      editable: true
    }
  ])

  const handbookColumns = computed<{ [key: string]: ComputedRef<Column<any, any, any>[]> }>(() => ({
    cities_columns,
    daily_payment_columns,
    grades_columns,
    hotels_columns,
    planning_periods_columns,
    states_columns,
    train_tickets_columns,
    plane_tickets_columns,
    trip_purposes_columns,
    budget_codes_columns,
    trip_types_columns,
    trip_goals_columns,
    fin_structures_columns,
    accounts_columns,
    users_columns,
    user_roles_columns,
    user_access_columns,
    limits_columns,
    limit_divisions_columns: limits_columns,
    version_statuss_columns,
    versions_columns,
    expense_types_columns
  }))

  return { handbookColumns }
}
