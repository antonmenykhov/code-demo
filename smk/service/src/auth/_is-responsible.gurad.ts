import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserInfoDto } from './dto/user-info.dto';

@Injectable()
export class IsResponsibleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
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
      req.user = user;
      if (await this.authService.checkResponsible(user.EmployeeId)) return true;
      const deaputyId = await this.authService.getDeputy(user.EmployeeId);
      if (deaputyId && (await this.authService.checkResponsible(deaputyId))) {
        req.user.EmployeeId = deaputyId;
        return true;
      }
      return false;
    } catch (e) {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
