import { IsNumber } from 'class-validator';

export class ReorderDto {
  @IsNumber()
  newOrder: number;
  @IsNumber()
  oldOrder: number;
}
