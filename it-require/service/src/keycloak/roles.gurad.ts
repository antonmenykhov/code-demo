import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenRepresentationFull } from './dto/access-token-representation-full.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const roles = this.reflector.getAllAndOverride('roles', [
        context.getHandler(),
        context.getClass(),
      ]) as string[];

      const service =
        this.reflector.getAllAndOverride('service', [
          context.getHandler(),
          context.getClass(),
        ]) || 'role-manager';
      const req = context.switchToHttp().getRequest();
      const tokenParsed = req.parsedToken as AccessTokenRepresentationFull;
      if (
        tokenParsed.resource_access[service]?.roles.some((existRole) =>
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
