import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Роли')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }
}
