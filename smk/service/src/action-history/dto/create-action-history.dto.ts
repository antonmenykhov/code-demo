import { IsNumber, IsString } from 'class-validator';

export class CreateActionHistoryDto {
  @IsString()
  event: string;
  @IsString()
  userId: string;
  @IsNumber()
  actionId: number;
}
