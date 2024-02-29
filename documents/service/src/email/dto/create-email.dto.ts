import { IsNumber, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsString()
  login: string;
  @IsString()
  password: string;
  @IsString()
  host: string;
  @IsNumber()
  port: number;
}
