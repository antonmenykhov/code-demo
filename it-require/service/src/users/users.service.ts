import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { KeycloakService } from 'src/keycloak/keycloak.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private keycloakService: KeycloakService) {}

  public users: UserRepresentation[] = [];

  findAll() {
    return this.users;
  }

  async getAllUsers() {
    this.users = await this.keycloakService.kcAdminClient.users.find({
      realm: this.keycloakService.workRealm,
      max: 10000,
    });
    setTimeout(
      () => {
        this.getAllUsers();
      },
      1000 * 60 * 60 * 5,
    );
  }

  onModuleInit() {
    this.getAllUsers();
  }
}
