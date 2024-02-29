import { IsDateString, IsString } from 'class-validator';

export class CreateSurveyPeriodDto {
  @IsDateString()
  start: Date;
  @IsDateString()
  finish: Date;
  @IsString()
  periodName: string;
}
