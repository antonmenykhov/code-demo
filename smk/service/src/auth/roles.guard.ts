import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UserInfoDto } from './dto/user-info.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const rolesData = this.reflector.getAllAndOverride('rolesData', [
        context.getHandler(),
        context.getClass(),
      ]);
      const requiredRoles = rolesData.roles;

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (!authHeader)
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const publicKey = await this.authService.getPublicKey(token);
      const user = this.jwtService.verify(token, { publicKey }) as UserInfoDto;
      const roles = await this.authService.getRoles(user.EmployeeId);
      req.user = { ...user, roles };
      if (!requiredRoles) {
        return true;
      }
      if (roles.some((role) => requiredRoles.includes(role))) return true;
      const deaputyId = await this.authService.getDeputy(user.EmployeeId);
      if (deaputyId) {
        roles.push(...(await this.authService.getRoles(deaputyId)));
        req.user.EmployeeId = deaputyId;
        return roles.some((role) => requiredRoles.includes(role));
      }
      return false;
    } catch (e) {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
