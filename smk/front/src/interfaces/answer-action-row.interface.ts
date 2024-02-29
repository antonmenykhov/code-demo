import type { RawAnswerActionRow } from './raw-answer-action-row.interface'

export interface AnswerActionRowDto extends RawAnswerActionRow {
  docs: { name: string; path: string }[]
}
