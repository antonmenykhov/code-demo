import { baseUrl } from '@/config/baseUrl'
import type { Account } from '@/interfaces/account.interface'
import type { BudgetCode } from '@/interfaces/budget-code.interface'
import type { City } from '@/interfaces/city.interface'
import type { DailyPayment } from '@/interfaces/daily-payment.interface'
import type { ExpenseType } from '@/interfaces/expense-type'
import type { FinStructure } from '@/interfaces/fin-structure.interface'
import type { Grade } from '@/interfaces/grade.interface'
import type { Hotel } from '@/interfaces/hotel.interface'
import type { LimitDivision } from '@/interfaces/limit-division.interface'
import type { Limit } from '@/interfaces/limit.interface'
import type { PlanningPeriod } from '@/interfaces/planning-period.interface'
import type { State } from '@/interfaces/state.interface'
import type { Ticket } from '@/interfaces/ticket.interface'
import type { TripGoal } from '@/interfaces/trip-goal.interface'
import type { TripPurpose } from '@/interfaces/trip-purpose.interface'
import type { TripType } from '@/interfaces/trip-type.interface'
import type { UserAccess } from '@/interfaces/user-access.inteface'
import type { UserRole } from '@/interfaces/user-role.inteface'
import type { User } from '@/interfaces/user.inteface'
import type { VersionStatus } from '@/interfaces/version-status.interface'
import type { Version } from '@/interfaces/version.interface'
import { handbooksStore } from '@/store/hanbooks.store'
import type { AxiosInstance } from 'axios'
import { notify } from '@tnnc/tnnc-ui-kit'
import { inject } from 'vue'

export type HandbookList = {
  cities: City[]
  daily_payment: DailyPayment[]
  grades: Grade[]
  hotels: Hotel[]
  planning_periods: PlanningPeriod[]
  states: State[]
  plane_tickets: Ticket[]
  train_tickets: Ticket[]
  trip_purposes: TripPurpose[]
  budget_codes: BudgetCode[]
  trip_types: TripType[]
  trip_goals: TripGoal[]
  fin_structures: FinStructure[]
  accounts: Account[]
  users: User[]
  user_access: UserAccess[]
  user_roles: UserRole[]
  limits: Limit[]
  limit_divisions: LimitDivision[]
  versions: Version[]
  version_statuss: VersionStatus[]
  expense_types: ExpenseType[]
}

export type HandbookItem =
  | City
  | DailyPayment
  | Grade
  | Hotel
  | PlanningPeriod
  | State
  | Ticket
  | TripPurpose
  | BudgetCode
  | TripType
  | TripGoal
  | FinStructure
  | Account
  | User
  | UserAccess
  | UserRole
  | Limit
  | LimitDivision
  | Version
  | VersionStatus
  | ExpenseType

export default function useHandbooks(initHttp?: AxiosInstance) {
  const http = initHttp || (inject('http') as AxiosInstance)
  const { handbooks } = handbooksStore()

  async function getHandbook(multiplyName: keyof HandbookList) {
    return http
      .get(
        `${baseUrl}/list_all/${
          handbookListForSelection.find((item) => item.multiplyName === multiplyName)?.name
        }`
      )
      .then(({ data }) => {
        handbooks[multiplyName] = sortHandbook(data)
      })
  }

  async function deleteItem(name: string, multiplyName: keyof HandbookList, id: number | string) {
    return http
      .delete(`${baseUrl}/delete/${name}`, {
        data: {
          id
        }
      })
      .then(() => {
        const existIndex = handbooks[multiplyName].findIndex((item) => item.id === id)
        if (existIndex !== -1) {
          handbooks[multiplyName].splice(existIndex, 1)
        }
      })
      .catch(() => {
        notify('Удаление невозможно. Элемент используется в системе.', 'danger', 5000)
      })
  }

  async function addItem(name: string, multiplyName: keyof HandbookList, item: HandbookItem) {
    return http.post(`${baseUrl}/add/${name}`, { ...item, id: undefined }).then(({ data }) => {
      handbooks[multiplyName].push(data)
      handbooks[multiplyName] = sortHandbook(handbooks[multiplyName])
      return data
    })
  }

  async function updateItem(name: string, multiplyName: keyof HandbookList, item: HandbookItem) {
    return http.put(`${baseUrl}/update/${name}`, item).then(() => {
      const existIndex = handbooks[multiplyName].findIndex((it) => item.id === it.id)
      if (existIndex !== -1) {
        // @ts-ignore
        handbooks[multiplyName].splice(existIndex, 1, item)
        handbooks[multiplyName] = sortHandbook(handbooks[multiplyName])
      }
    })
  }

  function sortHandbook(handbook: any) {
    return handbook.sort((a: any, b: any) => {
      const keys = Object.keys(a)
      const nameKey = keys.find((key) => key.includes('name')) || 'id'
      if (a[nameKey] > b[nameKey]) return 1
      if (a[nameKey] < b[nameKey]) return -1
      return 0
    })
  }

  const handbookListForSelection: {
    name: string
    multiplyName: keyof HandbookList
    display: string
    denyEditing?: boolean
    denyFetch?: boolean
    hidden?: boolean
  }[] = [
    {
      name: 'city',
      multiplyName: 'cities',
      display: 'Города'
    },
    {
      name: 'city_extended',
      multiplyName: 'cities',
      display: 'Города, цены',
      denyFetch: true
    },
    {
      name: 'grade',
      multiplyName: 'grades',
      display: 'Грейды'
    },
    {
      name: 'planning_period',
      multiplyName: 'planning_periods',
      display: 'Периоды планирования'
    },
    {
      name: 'state',
      multiplyName: 'states',
      display: 'Состояния (период планирования)'
    },

    {
      name: 'trip_purpose',
      multiplyName: 'trip_purposes',
      display: 'Соответствие цели – статьи бюджета – счета затрат'
    },
    {
      name: 'trip_goal',
      multiplyName: 'trip_goals',
      display: 'Цели командировки'
    },
    {
      name: 'trip_type',
      multiplyName: 'trip_types',
      display: 'Типы командировки'
    },
    {
      name: 'budget_code',
      multiplyName: 'budget_codes',
      display: 'Статьи бюджета'
    },
    {
      name: 'account ',
      multiplyName: 'accounts',
      display: 'Счёта учета'
    },
    {
      name: 'fin_structure',
      multiplyName: 'fin_structures',
      display: 'Финансовая структура'
    },
    {
      name: 'daily_payment',
      multiplyName: 'daily_payment',
      display: 'Суточные/Полевое довольствие'
    },
    {
      name: 'limit',
      multiplyName: 'limits',
      display: 'Распределение лимитов'
    },
    {
      name: 'version',
      multiplyName: 'versions',
      display: 'Версии'
    },
    {
      name: 'version_status',
      multiplyName: 'version_statuss',
      display: 'Статусы версий'
    },
    {
      name: 'hotel',
      multiplyName: 'hotels',
      display: 'Отели',
      hidden: true
    },
    {
      name: 'plane_ticket',
      multiplyName: 'plane_tickets',
      display: 'Самолет',
      hidden: true
    },
    {
      name: 'train_ticket',
      multiplyName: 'train_tickets',
      display: 'Поезд',
      hidden: true
    },
    {
      name: 'limit_division',
      multiplyName: 'limit_divisions',
      display: 'Подразделения лимитов',
      hidden: true
    },
    {
      name: 'user',
      multiplyName: 'users',
      display: 'Пользователи',
      hidden: true
    },
    {
      name: 'user_access',
      multiplyName: 'user_access',
      display: 'Доступ пользователей',
      hidden: true
    },
    {
      name: 'user_role',
      multiplyName: 'user_roles',
      display: 'Роли пользователей',
      hidden: true
    },
    {
      name: 'expense_type',
      multiplyName: 'expense_types',
      display: 'Классификация расходов'
    }
  ]

  async function getAllHandbooks() {
    for await (const handbook of handbookListForSelection) {
      if (!handbook.denyFetch) await getHandbook(handbook.multiplyName)
    }
  }

  return { getHandbook, deleteItem, addItem, updateItem, getAllHandbooks, handbookListForSelection }
}
