import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('JwtAuthGuard canActivate is working!!!');
    const gqlCtx = context.getArgByIndex(2);
    const request: Request = gqlCtx.req;
    const token = request?.cookies.access_token;
    JwtAuthGuard.validateToken(token);
    return true;
  }

  public static validateToken(token: string) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }
}
