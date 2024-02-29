import type { ActionProlongation } from './action-prolongation.interface'
import type { ActionState } from './action-state.interface'
import type { Answer } from './answer.interface'
import type { File } from './file.interface'

export interface Action {
  id: number
  answer: Answer
  answerId: number
  reason: string
  action: string
  responsible: string
  dateFinish: Date
  factDateFinish: Date
  administratorComment: string
  managerComment: string
  completeComment: string
  documents: File[]
  state: ActionState
  stateId: number
  prolongations: ActionProlongation[]
}
