import type { Question } from './question.interface'
import type { Request } from './request.interface'

export interface Answer {
  id: number
  answer: string
  question?: Question[]
  questionId: number
  request?: Request
  requestId: number
}

export type CreateAnswerDto = Omit<Answer, 'id' | 'request' | 'question'>
