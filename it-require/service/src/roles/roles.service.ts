import { Injectable } from '@nestjs/common';
import { KeycloakService } from 'src/keycloak/keycloak.service';

@Injectable()
export class RolesService {
  constructor(private keycloakService: KeycloakService) {}

  getAllRoles() {
    return this.keycloakService.kcAdminClient.clients.listRoles({
      realm: this.keycloakService.workRealm,
      id: this.keycloakService.keycloakRealmClientId,
    });
  }
}
