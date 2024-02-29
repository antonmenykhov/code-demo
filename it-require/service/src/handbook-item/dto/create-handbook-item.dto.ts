import { IsNumber, IsString } from 'class-validator';

export class CreateHandbookItemDto {
  @IsString()
  name: string;
  @IsNumber()
  handbookId: number;
}
