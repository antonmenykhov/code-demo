import type { BlockDepartment } from '@/interfaces/supp-entities/block-department.interface'
import type { CommentStatusCalendarPlan } from '@/interfaces/supp-entities/comment-status-calendar-plan.interface'
import type { CuratorDepartment } from '@/interfaces/supp-entities/curator-department.interface'
import type { Department } from '@/interfaces/supp-entities/department.interface'
import type { DepartmentOrganization } from '@/interfaces/supp-entities/departmentOrganization.interface'
import type { DirectWork } from '@/interfaces/supp-entities/direct-work.interface'
import type { ExportCustomer } from '@/interfaces/supp-entities/export-customer.interface'
import type { FormatGeneralContract } from '@/interfaces/supp-entities/format-general-contract.interface'
import type { KindWork } from '@/interfaces/supp-entities/kind-work.interface'
import type { Nds } from '@/interfaces/supp-entities/nds.interface'
import type { Organization } from '@/interfaces/supp-entities/organization.interface'
import type { ReasonWorkSubcontract } from '@/interfaces/supp-entities/reason-work-subcontract.interface'
import type { ScopeWorkSubcontract } from '@/interfaces/supp-entities/scope-work-subcontract.interface'
import type { StatusCalendarPlan } from '@/interfaces/supp-entities/status-calendar-plan.interface'
import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import useHandbooksHttp from '../../../composables/http/use-handbooks-http.composable'
import type { GroupKindWork } from '@/interfaces/supp-entities/group-kind-work.interface'
import type { GroupDepartment } from '@/interfaces/supp-entities/group-department.interface'
import type { PerimeterPeriod } from '@/interfaces/supp-entities/perimeter-period.interface'
import type { IndustrialBlock } from '@/interfaces/supp-entities/industrial-block.interface'
import type { NoNds } from '@/interfaces/supp-entities/no-nds.interface'
import type { ReportEconomicSection } from '@/interfaces/supp-entities/report-economic-section.interface'
import type { SectionError } from '@/interfaces/supp-entities/section-error.interface'
import type { DecodeError } from '@/interfaces/supp-entities/decode-error.interface'
import type { NumberContract } from '@/interfaces/supp-entities/number-contract.interface'
import type { CalendarPlan } from '@/interfaces/supp-entities/calendar-plan.interface'

export type TprHandbook = {
  organization: Organization[]
  curatorDepartment: CuratorDepartment[]
  kindWork: KindWork[]
  groupKindWork: GroupKindWork[]
  directWork: DirectWork[]
  statusCalendarPlan: StatusCalendarPlan[]
  department: Department[]
  departmentOrganization: DepartmentOrganization[]
  nds: Nds[]
  formatGeneralContract: FormatGeneralContract[]
  scopeWorkSubcontract: ScopeWorkSubcontract[]
  reasonWorkSubcontract: ReasonWorkSubcontract[]
  commentStatusCalendarPlan: CommentStatusCalendarPlan[]
  blockDepartment: BlockDepartment[]
  exportCustomer: ExportCustomer[]
  groupDepartment: GroupDepartment[]
  perimeterPeriod: PerimeterPeriod[]
  industrialBlock: IndustrialBlock[]
  noNds: NoNds[]
  reportEconomicSection: ReportEconomicSection[]
  sectionError: SectionError[]
  decodeError: DecodeError[]
  numberContract: NumberContract[]
  calendarPlan: CalendarPlan[]
}

export interface BooleanHandbook {
  id: boolean | null
  name: string
}

export type TprHandbookExtended = TprHandbook & {
  months: { id: number; name: string }[]
  genwork: BooleanHandbook[]
  capex: BooleanHandbook[]
  yesNo: BooleanHandbook[]
}

export default function useHandbooks() {
  const {
    getSuppHandbooksByArrayOfNames,
    getOneSuppHandbook,
    createSuppHandbookItem: createSuppHandbookItemHttp,
    updateSuppHandbookItem: updateSuppHandbookItemHttp,
    deleteSuppHandbookItem: deleteSuppHandbookItemHttp
  } = useHandbooksHttp()
  const { suppHandbooks } = storeToRefs(useHandbookStore())
  const { setHandbook } = useHandbookStore()

  async function getAllHandbookNew() {
    return getSuppHandbooksByArrayOfNames(Object.keys(suppHandbooks.value)).then(({ data }) => {
      suppHandbooks.value = data[0]
    })
  }

  async function getOneHandbookAndInsert<K extends keyof TprHandbook, T extends TprHandbook[K]>(
    handbookName: K
  ) {
    return getOneSuppHandbook<T>(handbookName).then(({ data }) => {
      data = Array.isArray(data)
        ? // @ts-ignore
          data.filter((item: any) => ('close' in item ? !item.close : true))
        : data
      setHandbook(handbookName, data)
    })
  }

  async function createSuppHandbookItem<T, K = T>(handbookName: keyof TprHandbook, payload: K) {
    return createSuppHandbookItemHttp<T, K>(handbookName, payload).then(() => {
      return getOneHandbookAndInsert(handbookName)
    })
  }

  async function updateSuppHandbookItem<T, K = T>(handbookName: keyof TprHandbook, payload: K) {
    return updateSuppHandbookItemHttp<T, K>(handbookName, payload).then(() => {
      return getOneHandbookAndInsert(handbookName)
    })
  }
  async function deleteSuppHandbookItem<T, K = T>(handbookName: keyof TprHandbook, payload: K) {
    return deleteSuppHandbookItemHttp<T, K>(handbookName, payload).then(() => {
      return getOneHandbookAndInsert(handbookName)
    })
  }

  return {
    getAllHandbookNew,
    createSuppHandbookItem,
    updateSuppHandbookItem,
    deleteSuppHandbookItem
  }
}
