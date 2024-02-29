import { IsString } from 'class-validator';

export class CreateUserInfoDto {
  @IsString()
  email: string;
  @IsString()
  userId: string;
}
