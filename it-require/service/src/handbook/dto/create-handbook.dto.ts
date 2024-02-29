import { IsString } from 'class-validator';

export class CreateHandbookDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
}
