import type { Action } from './action.interface'

export interface File {
  id: number
  path: string
  action: Action
  actionId: number
  fileName: string
}
