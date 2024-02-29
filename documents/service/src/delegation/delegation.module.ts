import { Module } from '@nestjs/common';
import { DelegationService } from './delegation.service';
import { DelegationController } from './delegation.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  controllers: [DelegationController],
  providers: [DelegationService],
  imports: [KeycloakModule],
  exports: [DelegationService],
})
export class DelegationModule {}
