import { IsNumber, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  answer: string;

  @IsNumber()
  questionId: number;
  @IsNumber()
  requestId: number;
}
