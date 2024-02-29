import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { QuestionGroup } from 'src/question-group/entities/question-group.entity';

export class CreateQuestionDto {
  @IsString()
  text: string;
  @IsObject()
  @Type(() => QuestionGroup)
  group: QuestionGroup;
  @IsNumber()
  order: number;
}
