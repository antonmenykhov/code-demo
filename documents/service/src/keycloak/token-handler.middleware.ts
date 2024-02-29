import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class TokenHandlerMiddleware implements NestMiddleware {
  constructor(private readonly keycloakService: KeycloakService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || (req.query.token as string);
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
