import { Injectable } from '@nestjs/common';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { RoleUserDto } from './dto/role-user.dto';

@Injectable()
export class RolesService {
  constructor(private keycloakService: KeycloakService) {}

  async findAll() {
    return await this.keycloakService.getRoles();
  }
  async addRolesToUser(roleUserDto: RoleUserDto) {
    return await this.keycloakService.addRoles(roleUserDto);
  }

  async removeRolesFromUser(roleUserDto: RoleUserDto) {
    return await this.keycloakService.deleteRoles(roleUserDto);
  }
}
