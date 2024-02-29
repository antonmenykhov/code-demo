import kindWorkColumns from './kindWork'
import { curatorDepartment } from './curatorDepartment'
import { nds } from './nds'
import { blockDepartment } from './blockDepartment'
import departmentColumns from './department'
import { groupKindWork } from './groupKindWork'
import { groupDepartment } from './groupDepartment'
import organizationColumns from './organization'
import { statusCalendarPlan } from './statusCalendarPlan'
import directWorkColumns from './directWork'
import { departmentOrganization } from './departmentOrganization'
import perimeterPeriodColumns from './perimeterPeriod'
import { formatGeneralContract } from './formatGeneralContract'
import commentStatusCalendarPlanColumns from './commentStatusCalendarPlan'
import noNdsColumns from './noNds'
import industrialBlockColumns from './industrialBlock'
import reportEconomicSectionColumns from './reportEconomicSection'
import exportCustomerColumns from './exportCustomer'
import { sectionError } from './sectionError'
import decodeErrorColumns from './decodeError'
import calendarPlanColumns from './calendarPlan'
import { computed } from 'vue'
import type { Column } from 'tnnc-ui-kit'
import type { TprHandbook } from '../composables/useHandbooks.composable'

export default function useHandbookColumns() {
  const { calendarPlan } = calendarPlanColumns()
  const { kindWork } = kindWorkColumns()
  const { department } = departmentColumns()
  const { organization } = organizationColumns()
  const { directWork } = directWorkColumns()
  const { perimeterPeriod } = perimeterPeriodColumns()
  const { commentStatusCalendarPlan } = commentStatusCalendarPlanColumns()
  const { noNds } = noNdsColumns()
  const { industrialBlock } = industrialBlockColumns()
  const { reportEconomicSection } = reportEconomicSectionColumns()
  const { exportCustomer } = exportCustomerColumns()
  const { decodeError } = decodeErrorColumns()

  const columns = computed<{ [key in keyof TprHandbook]: Column[] }>(() => ({
    kindWork: kindWork.value,
    curatorDepartment,
    nds,
    blockDepartment,
    department: department.value,
    groupDepartment,
    groupKindWork,
    organization: organization.value,
    statusCalendarPlan,
    directWork: directWork.value,
    departmentOrganization,
    perimeterPeriod: perimeterPeriod.value,
    formatGeneralContract,
    scopeWorkSubcontract: formatGeneralContract,
    reasonWorkSubcontract: formatGeneralContract,
    commentStatusCalendarPlan: commentStatusCalendarPlan.value,
    noNds: noNds.value,
    industrialBlock: industrialBlock.value,
    reportEconomicSection: reportEconomicSection.value,
    exportCustomer: exportCustomer.value,
    sectionError,
    decodeError: decodeError.value,
    numberContract: curatorDepartment,
    calendarPlan: calendarPlan.value
  }))
  return { columns }
}
