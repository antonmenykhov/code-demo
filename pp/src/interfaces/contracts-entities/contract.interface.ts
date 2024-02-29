import type { ContractIndexes } from './contract-indexes.interface'
import type { Project } from './project.interface'
import type { Stage } from './stage.interface'

export interface Contract {
  id: string
  number: string
  numberFormated: string
  name: string
  start: string
  finish: string
  price: string
  realSignDate: string
  genwork: true
  parentId: null | string
  linkedId: null | string
  typeId: string
  statusId: string
  ndsId: string
  curatorId: string
  customerId: string
  divisionId: string
  managerId: string
  stages: Stage[]
  projects: Project[]
  indexes: ContractIndexes[]
  curator_name: string
  status_name: string
  type_name: string
  customer_name: string
  nds_name: string
  division_name: string
  manager_name: string
}
