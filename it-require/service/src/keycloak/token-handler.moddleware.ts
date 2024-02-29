import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenHandlerMiddleware implements NestMiddleware {
  constructor(private readonly keycloakService: KeycloakService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException();
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token || token.length === 0)
      throw new UnauthorizedException();
    // @ts-ignore
    req.parsedToken = await this.keycloakService.verifyAndDecodeToken(token);
    // @ts-ignore
    req.token = token;
    next();
  }
}
