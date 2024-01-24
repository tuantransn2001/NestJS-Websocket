import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthGuard } from '../guard/jwt-authGuard';

@Injectable()
export class HttpAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.access_token;
      JwtAuthGuard.validateToken(token);
      next();
    } catch (err) {
      throw new UnauthorizedException('In-valid token');
    }
  }
}
