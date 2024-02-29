import type { ContractorDirector } from './contractor-director.interface'
import type { DocumentItem } from './document-item.interface'

export interface Contractor {
  id: number
  name: string
  shortName: string
  reqisits: string
  email: string
  address: string
  documents: DocumentItem[]
  directors: ContractorDirector[]
}
