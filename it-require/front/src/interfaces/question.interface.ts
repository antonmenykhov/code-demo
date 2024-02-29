import type { Answer } from './answer.interface'
import type { Form } from './form.inteface'
import type { RequestComment } from './request.interface'

export interface Question {
  id: number
  text: string
  type: 'date' | 'number' | 'string' | 'handbook'
  conditionParentValue: string | null
  handbookId: number | null
  children?: Question[]
  parent?: Question
  forms?: Form[]
  answers?: Answer[]
  order: number
  isGroup: boolean
  comments?: RequestComment[]
  isRequired: boolean
  description: string | null
}

export type CreateQuestionDto = Omit<
  Question,
  'id' | 'children' | 'parent' | 'forms' | 'answers' | 'comments'
> & { parentId?: number }
