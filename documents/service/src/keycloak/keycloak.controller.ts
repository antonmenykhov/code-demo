import { Controller, Get } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Controller()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @Get()
  getUsers() {
    return this.keycloakService.getRoles();
  }
}
