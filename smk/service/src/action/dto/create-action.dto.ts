import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateActionDto {
  @IsNumber()
  answerId: number;
  @IsString()
  reason: string;
  @IsString()
  action: string;
  @IsString()
  responsible: string;
  @IsDateString()
  dateFinish: Date;
}
