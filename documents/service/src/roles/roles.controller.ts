import { Controller, Get, Post, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleUserDto } from './dto/role-user.dto';
import { Roles } from './roles.decorator';

@ApiTags('Роли')
@Controller('role')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Найти все' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Roles(['Initier'])
  @Post('/add')
  addRoleToUser(@Body() roleDto: RoleUserDto) {
    return this.rolesService.addRolesToUser(roleDto);
  }

  @Roles(['Initier'])
  @Post('/remove')
  removeRoleFromser(@Body() roleDto: RoleUserDto) {
    return this.rolesService.removeRolesFromUser(roleDto);
  }
}
