import type { Action } from './action.interface'
import type { Question } from './question.interface'
import type { SurveyPeriod } from './survey-period.interface'
import type { User } from './user.interface'

export interface Answer {
  id: number
  question: Question
  numericVariant?: number
  comment?: string
  user?: User
  period?: SurveyPeriod
  correctAction?: Action
}
