import type { TprConnection } from './tpr-connection.interface'

export interface Stage {
  id: string
  name: string
  start: string
  finish: string
  price: string
  priceNds: string
  durationCD: number
  durationWD: number
  contentsNumber: string
  fact: boolean
  parentId: string | null
  linkedId: string | null
  genwork: boolean
  contractId: string
  performerId: string
  ndsId: string
  suppProjectId: number
  nds?: {
    id: string
    name: string
    percent: number
  }
  nds_name?: string
  suppProject?: TprConnection | null
}
