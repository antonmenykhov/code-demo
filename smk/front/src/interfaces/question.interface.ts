import type { Answer } from './answer.interface';
import type { QuestionGroup } from './question-group.interface';

export interface Question {
  id: number;
  text: string;
  group: QuestionGroup;
  order: number;
  answers?: Answer[];
}
