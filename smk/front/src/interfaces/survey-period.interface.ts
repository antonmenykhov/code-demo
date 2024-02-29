import type { Answer } from './answer.interface'
import type { SurveyCompleteion } from './survey-completion.interface'

export interface SurveyPeriod {
  id: number
  start: Date
  finish: Date
  periodName: string
  answers?: Answer[]
  completions?: SurveyCompleteion[]
  resultsSended: boolean
}
