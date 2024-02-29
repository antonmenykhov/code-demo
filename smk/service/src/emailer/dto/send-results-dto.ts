import { IsDateString, IsNumber } from 'class-validator';

export class SendResultsDto {
  @IsDateString()
  dateInput: Date;
  @IsDateString()
  dateQuestions: Date;
  @IsNumber()
  periodId: number;
}
