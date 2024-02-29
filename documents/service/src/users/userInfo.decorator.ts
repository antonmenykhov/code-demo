import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.parsedToken as AccessTokenRepresentationFull;
  },
);
