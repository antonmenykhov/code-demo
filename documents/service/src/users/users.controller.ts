import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';

@ApiTags('Пользователи')
@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiBearerAuth()
  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(['Initier'])
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiBearerAuth()
  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }

  @Roles(['Initier'])
  @ApiOperation({ summary: 'Обновить информацию пользователя' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.userService.update(id, UpdateUserDto);
  }

  @Roles(['Initier'])
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
