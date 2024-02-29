import type { Action } from './action.interface'

export interface ActionProlongation {
  id: number
  date: string
  reason: string
  action: Action
  aprooved: boolean
  actionId: number
}
