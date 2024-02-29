import type { Answer } from './answer.interface'
import type { Form } from './form.inteface'
import type { Question } from './question.interface'

export interface Request {
  id: number
  userId: string
  form?: Form
  formId: number
  answers?: Answer[]
  stage?: RequestStage
  stageId: number
  comments?: RequestComment[]
}

export type CreateRequestDto = Omit<
  Request,
  'id' | 'stage' | 'stageId' | 'answers' | 'form' | 'userId' | 'comments'
>

export interface RequestStage {
  id: number
  name: string
  requests?: Request[]
  nextStageId: number | null
  previousStageId: number | null
  roleId: string | null
  initialStage: boolean
}

export type CreateRequestStageDto = Omit<RequestStage, 'id' | 'requests'>

export interface RequestComment {
  id: number
  comment: string
  userId: string
  request?: Request
  requestId: number
  question?: Question
  questionId: number
}

export type CreateRequestComment = Omit<RequestComment, 'id' | 'userId' | 'request' | 'question'>
