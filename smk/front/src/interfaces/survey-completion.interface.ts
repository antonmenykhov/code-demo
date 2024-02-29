import type { SurveyPeriod } from './survey-period.interface'
import type { User } from './user.interface'

export interface SurveyCompleteion {
  id: number
  period: SurveyPeriod
  user: User
}
