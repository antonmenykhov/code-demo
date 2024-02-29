import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.token as string;
  },
);
