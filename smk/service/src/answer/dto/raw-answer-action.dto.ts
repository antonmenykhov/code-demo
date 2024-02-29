import { RawAnswerRowDto } from './raw-answer-row.dto';
export interface RawAnswerActionDto extends RawAnswerRowDto {
  reason: string;
  action: string;
  responsible: string;
  dateFinish: string;
  factDateFinish: string;
  state: string;
  completeComment: string;
  documentPath?: string;
  documentName?: string;
}
