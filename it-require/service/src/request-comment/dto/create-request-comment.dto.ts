import { IsNumber, IsString } from 'class-validator';

export class CreateRequestCommentDto {
  @IsString()
  comment: string;
  @IsNumber()
  requestId: number;
  @IsNumber()
  questionId: number;

  userId: string;
}
