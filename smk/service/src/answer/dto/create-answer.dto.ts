import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Question } from 'src/question/entities/question.entity';

export class CreateAnswerDto {
  @IsObject()
  @Type(() => Question)
  question: Question;
  @IsOptional()
  @IsNumber()
  numericVariant?: number;
  @IsOptional()
  @IsString()
  comment?: string;
}
