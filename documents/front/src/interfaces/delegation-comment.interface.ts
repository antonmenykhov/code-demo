import type { Delegation } from './delegation.interface'

export interface DelegationComment {
  id: number
  comment: string
  fromId: string
  delegationId: number
  delegation?: Delegation
}

export interface DelegationCommentDto {
  comment: string
  fromId: string
  delegationId: number
}
