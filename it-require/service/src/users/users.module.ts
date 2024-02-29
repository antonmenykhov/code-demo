import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [KeycloakModule],
  exports: [UsersService],
})
export class UsersModule {}
