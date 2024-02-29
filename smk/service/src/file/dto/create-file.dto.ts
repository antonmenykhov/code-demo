import { IsNumberString, IsString } from 'class-validator';

export class CreateFileDto {
  @IsNumberString()
  actionId: number;
  @IsString()
  fileName: string;
}
