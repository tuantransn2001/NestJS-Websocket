import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtAuthGuard } from './jwt-authGuard';

@Injectable()
export class WsGuard implements CanActivate {
  private readonly logger = new Logger();

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization;
    JwtAuthGuard.validateToken(token);
    this.logger.log('WsGuard canActivate is working!!!');
    return true;
  }
}
