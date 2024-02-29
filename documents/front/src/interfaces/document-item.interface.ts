import type { Attachment } from './attachment.interface'
import type { Company, CompanyAdditionalSigner } from './company.interface'
import type { ContractorDirector } from './contractor-director.interface'
import type { Contractor } from './contractor.interface'
import type { Delegation } from './delegation.interface'
import type { DocumentReadingMark } from './document-reading-mark.interface'
import type { Emailer } from './email.interface'

export interface DocumentItem {
  id: number
  name: string
  regnumber: number
  content: string
  created: string
  isIncoming: boolean
  contractor: Contractor | null
  contractorId: number | ''
  contractorDirector: ContractorDirector | null
  contractorDirectorId: number | ''
  attachment: Attachment | null
  attachmentId: number | null
  company: Company | null
  companyId: number | ''
  delegations: Delegation[]
  parent?: DocumentItem
  parentId?: number
  child?: DocumentItem
  isStamped?: boolean
  isCompleted?: boolean
  isExternalRegistered?: boolean
  isRegistered: boolean
  externalRegnumber: string
  externalCreated: string
  recieptId: number | ''
  reciept: Attachment | null
  readingMarks: DocumentReadingMark[]
  additionalContractors: DocumentAdditionalContractor[]
  additionalAttachments: Attachment[]
  workerId: string | null
  withWorkerMark: boolean
  companyEmailToWorkerMark: boolean
  additionalSigners: CompanyAdditionalSigner[]
  emailers?: Emailer[]
  groupLeaderId: number | null
  group?: (DocumentItem | DocumentReport)[]
}

export interface DocumentReport extends DocumentItem {
  dateTo: string
  contractorName: string
  companyName: string
  createdFormated: string
  reportName: string
  states: string[]
}

export interface DocumentAdditionalContractor {
  id: number
  contractor: Contractor | null
  contractorId: number | ''
  contractorDirector: ContractorDirector | null
  contractorDirectorId: number | ''
  document: DocumentItem | null
  documentId: number
}

export type DocumentAdditionalContractorDto = Pick<
  DocumentAdditionalContractor,
  'contractorDirectorId' | 'contractorId' | 'documentId'
>
