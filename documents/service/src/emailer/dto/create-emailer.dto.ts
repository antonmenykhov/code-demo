import { IsNumber, IsString } from 'class-validator';

export class CreateEmailerDto {
  @IsNumber()
  documentId: number;
  @IsString()
  fromEmail: string;
  @IsString()
  toEmail: string;
  @IsString()
  message: string;
  @IsString()
  theme: string;
  @IsNumber()
  fromEmailId: number;
  userId: string;
}
