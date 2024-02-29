import type { Question } from './question.interface'
import type { Responsible } from './responsible.interface'

export interface QuestionGroup {
  id: number
  name: string
  order: number
  questions: Question[]
  departmentId: string
  responsibles: Responsible[]
  disableZeroAnswers: boolean
}
