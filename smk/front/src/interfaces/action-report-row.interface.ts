import type { Action } from './action.interface'
import type { Answer } from './answer.interface'

export type ActionReportRow = Action & Answer & { groupText: string; questionText: string }
