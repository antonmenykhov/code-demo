import type { Action } from './action.interface'

export interface ActionState {
  id: number
  name: string
  nameForUser: string
  kdOpened: boolean
  prolongationOpened: boolean
  reportOpened: boolean
  actions: Action[]
  whoCanChangeState: 'ADMINISTRATOR' | 'MANAGER' | 'RESPONDENT' | 'RESPONSIBLE' | 'NOBODY'
  nextStateId?: number
  returnStateId?: number
  isReturnedState: boolean
  isProlongationState: boolean
}
