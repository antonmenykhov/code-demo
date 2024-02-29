import type { TprStandart } from './tpr-standart.interface'

export interface TprError {
  ID: number
  head: string
  description: string
  reason: string
  code: number
  levels: number
  contract: string
  department: string
  fields: null | (keyof TprStandart)[]
}
