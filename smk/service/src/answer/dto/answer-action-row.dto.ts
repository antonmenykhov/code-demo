import { RawAnswerActionDto } from './raw-answer-action.dto';

export interface AnswerActionRowDto extends RawAnswerActionDto {
  docs: { name: string; path: string }[];
}
