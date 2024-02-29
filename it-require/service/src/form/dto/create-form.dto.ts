import { IsArray, IsOptional, IsString } from 'class-validator';
import { Question } from 'src/question/entities/question.entity';

export class CreateFormDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsArray()
  questions?: Question[];
}
