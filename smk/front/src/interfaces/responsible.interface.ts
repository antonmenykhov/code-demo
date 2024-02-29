import type { QuestionGroup } from './question-group.interface'

export interface Responsible {
  id: number
  userId: string
  questionGroup: QuestionGroup
  questionGroupId: number
  userName: string
  userEmail: string
  tabNumber: string
}
