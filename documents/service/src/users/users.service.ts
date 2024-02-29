import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KeycloakService } from 'src/keycloak/keycloak.service';

@Injectable()
export class UsersService {
  constructor(private keycloakService: KeycloakService) {}
  async findAll() {
    return this.keycloakService.getUsers();
  }
  async findOne(id: string) {
    return this.keycloakService.getUser(id);
  }
  async remove(id: string): Promise<void> {
    await this.keycloakService.deleteUser(id);
  }
  async create(userDto: CreateUserDto) {
    const { id } = await this.keycloakService.createUser(userDto);
    return this.keycloakService.getUser(id);
  }
  async update(id: string, dto: UpdateUserDto): Promise<any> {
    await this.keycloakService.updateUser(id, dto);
    return this.keycloakService.getUser(id);
  }
}
