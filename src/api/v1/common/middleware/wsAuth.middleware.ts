import { Socket } from 'socket.io';
import { JwtAuthGuard } from '../guard/jwt-authGuard';

export type WsAuthMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const WsAuthMiddleware = (): WsAuthMiddleware => {
  return async (client, next) => {
    try {
      const token = client?.handshake?.headers.authorization;
      JwtAuthGuard.validateToken(token);
      next();
    } catch (err) {
      next(err);
    }
  };
};
