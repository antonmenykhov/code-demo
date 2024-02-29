import type { AnswerReportRow } from './answer-report-row.interface'

export interface RawAnswerActionRow extends AnswerReportRow {
  reason: string
  action: string
  responsible: string
  dateFinish: string
  state: string
  completeComment: string
  documentPath?: string
  documentName?: string
}
