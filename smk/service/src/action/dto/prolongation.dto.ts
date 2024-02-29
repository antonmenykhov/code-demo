import { IsDateString, IsString } from 'class-validator';

export class ProlongationDto {
  @IsDateString()
  date: Date;
  @IsString()
  reason: string;
}
