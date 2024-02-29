import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Question } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsString()
  text: string;
  @IsString()
  type: 'date' | 'number' | 'string' | 'handbook';
  @IsString()
  conditionParentValue: string | null;
  @IsOptional()
  @IsNumber()
  parentId: number;
  @IsOptional()
  @IsNumber()
  handbookId: number;
  @IsNumber()
  order: number;
  @IsBoolean()
  isGroup: boolean;
  @IsBoolean()
  isRequired: boolean;
  @IsOptional()
  @IsString()
  description: string | null;

  parent: Question;
}
