import type { DelegationComment } from './delegation-comment.interface'
import type { DocumentItem } from './document-item.interface'
import type { User } from './user.interface'

export interface Delegation {
  id: number
  from: User | null
  fromId: string
  to: User | null
  toId: string
  document: DocumentItem | null
  documentId: number
  description: string
  date: string
  parent: Delegation | null
  parentId: number | null
  childs: Delegation[]
  isReaded: boolean
  updated: string
  created: string
  isAprooved: boolean
  isNeedAprooving?: boolean
  isActive: boolean
  comments: DelegationComment[]
}

export interface CreateDelegationDto {
  fromId: string
  toId: string
  documentId: number
  description: string
  date: string
  parentId: number | null
  isNeedAprooving?: boolean
  isReaded?: boolean
}
