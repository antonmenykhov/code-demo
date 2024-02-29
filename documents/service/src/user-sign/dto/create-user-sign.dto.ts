import { IsNumber, IsString } from 'class-validator';

export class CreateUserSignDto {
  @IsString()
  userId: string;
  @IsNumber()
  attachmentId: number;
}
