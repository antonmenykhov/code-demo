import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [KeycloakModule],
})
export class RolesModule {}
