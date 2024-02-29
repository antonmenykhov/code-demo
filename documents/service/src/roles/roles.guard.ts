import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.getAllAndOverride('roles', [
        context.getHandler(),
      ]) as string[];
      const service =
        this.reflector.getAllAndOverride('service', [context.getHandler()]) ||
        'documents';
      const req = context.switchToHttp().getRequest();
      const tokenParsed = req.parsedToken as AccessTokenRepresentationFull;
      if (
        tokenParsed.resource_access[service]?.roles.some((existRole: string) =>
          roles.includes(existRole),
        )
      )
        return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
