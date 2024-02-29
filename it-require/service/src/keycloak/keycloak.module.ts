import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { TokenHandlerMiddleware } from './token-handler.moddleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [KeycloakService, TokenHandlerMiddleware, JwtService],
  exports: [KeycloakService, TokenHandlerMiddleware, JwtService],
})
export class KeycloakModule {}
