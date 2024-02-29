import { IsNumber } from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  formId: number;

  userId: string;
  stageId: number;
}
