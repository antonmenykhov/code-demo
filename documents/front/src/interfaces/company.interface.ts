import type { Contractor } from './contractor.interface'
import type { Attachment } from './attachment.interface'
import type { DocumentItem } from './document-item.interface'
import type { Email } from './email.interface'

export interface Company extends Omit<Contractor, 'directors' | 'shortName'> {
  stampId: null | number
  stamp?: Attachment
  manager: string
  headerId: null | number
  header?: Attachment
  pathToDir: string
  additionalSigners: CompanyAdditionalSigner[]
  defaultEmail: Email | null
  defaultEmailId: number | null
}

export interface CompanyAdditionalSigner {
  id: number
  name: string
  stamp?: Attachment
  stampId: number | null
  company?: Company
  companyId: number | null
  documents?: DocumentItem[]
}
