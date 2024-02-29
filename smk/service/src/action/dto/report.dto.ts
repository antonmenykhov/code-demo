import { IsDateString, IsString } from 'class-validator';

export class ActionReportDto {
  @IsString()
  comment: string;
  @IsDateString()
  date: string;
}
