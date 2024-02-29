import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { KeycloakController } from './keycloak.controller';
import { UserMapperInterceptor } from './userMapping.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { TokenHandlerMiddleware } from './token-handler.middleware';

@Module({
  // controllers: [KeycloakController],
  providers: [KeycloakService, UserMapperInterceptor, TokenHandlerMiddleware],
  exports: [
    KeycloakService,
    UserMapperInterceptor,
    TokenHandlerMiddleware,
    JwtModule,
  ],
  imports: [JwtModule.register({})],
})
export class KeycloakModule {}
