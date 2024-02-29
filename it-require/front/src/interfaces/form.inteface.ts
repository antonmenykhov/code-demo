import type { Question } from './question.interface'
import type { Request } from './request.interface'

export interface Form {
  id: number
  name: string
  questions?: Question[]
  requests?: Request[]
}

export type CreateFormDto = Omit<Form, 'id' | 'requests'>
