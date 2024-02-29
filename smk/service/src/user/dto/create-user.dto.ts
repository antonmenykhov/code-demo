import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'ID пользователя из штатки' })
  @IsString()
  userId: string;
}
