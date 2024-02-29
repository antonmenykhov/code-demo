export interface CalendarPlan {
  id: number
  name: string
  description: string
  start: string
  finish: string
  dateConclusionContractPlan: string
  dateConclusionContractFact: string
  numberContractId: number
  numberContractSubId: null | number
  statusCalendarPlanId: number
  totalContract: number
  ndsId: number
  parentId: null | number
  genwork: boolean
  risk: boolean
  internalOrder: string
  opex: boolean
  close: boolean
}
