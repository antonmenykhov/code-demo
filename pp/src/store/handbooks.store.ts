import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  TprHandbook,
  TprHandbookExtended
} from '@/widgets/handbooks/composables/useHandbooks.composable'
import { monthHandbook } from '@/hooks/months'

export const useHandbookStore = defineStore('handbookStore', () => {
  const suppHandbooks = ref<TprHandbook>({
    organization: [],
    curatorDepartment: [],
    kindWork: [],
    directWork: [],
    statusCalendarPlan: [],
    department: [],
    departmentOrganization: [],
    nds: [],
    formatGeneralContract: [],
    scopeWorkSubcontract: [],
    reasonWorkSubcontract: [],
    commentStatusCalendarPlan: [],
    blockDepartment: [],
    exportCustomer: [],
    industrialBlock: [],
    calendarPlan: [],
    noNds: [],
    numberContract: [],
    sectionError: [],
    decodeError: [],
    groupDepartment: [],
    groupKindWork: [],
    perimeterPeriod: [],
    reportEconomicSection: []
  })
  const handbooks = computed<TprHandbookExtended>(() => ({
    ...suppHandbooks.value,
    months: monthHandbook,
    genwork: [
      {
        name: 'Генподряд',
        id: true
      },
      {
        name: 'Субподряд',
        id: false
      }
    ],
    capex: [
      {
        name: 'OPEX',
        id: true
      },
      {
        name: 'CAPEX',
        id: false
      }
    ],
    yesNo: [
      {
        name: 'Да',
        id: true
      },
      {
        name: 'Нет',
        id: false
      }
    ]
  }))
  function setHandbook<K extends keyof TprHandbook, T extends TprHandbook[K]>(
    handbookName: K,
    handbook: T
  ) {
    suppHandbooks.value[handbookName] = handbook
  }
  return { handbooks, setHandbook, suppHandbooks }
})
