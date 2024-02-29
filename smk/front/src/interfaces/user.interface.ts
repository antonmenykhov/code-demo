import type { Answer } from './answer.interface'
import type { SurveyCompleteion } from './survey-completion.interface'

export interface User {
  id: number
  userId: string
  answers: Answer[]
  completions: SurveyCompleteion[]
  userName: string
  userEmail: string
  tabNumber: string
}
