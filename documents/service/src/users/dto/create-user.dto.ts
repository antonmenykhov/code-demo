import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsString({ message: 'Должен быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустой' })
  readonly email: string;

  @ApiProperty({ example: '123456789', description: 'Пароль' })
  @IsString({ message: 'Должен быть строкой' })
  readonly password: string;

  @ApiProperty({ example: 'Иванов И.И.', description: 'Имя' })
  @IsString({ message: 'Должен быть строкой' })
  readonly name: string;

  @ApiProperty({ example: 'Начальник отдела', description: 'Должность' })
  @IsString({ message: 'Должен быть строкой' })
  readonly position: string;

  @ApiProperty({ example: '8800553535', description: 'Телефон' })
  @IsString({ message: 'Должен быть строкой' })
  readonly phone: string;
}
