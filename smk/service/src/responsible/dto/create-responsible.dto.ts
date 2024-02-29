import { IsNumber, IsString } from 'class-validator';

export class CreateResponsibleDto {
  @IsString()
  userId: string;
  @IsNumber()
  questionGroupId: number;
}
