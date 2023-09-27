import { Socket } from 'socket.io';
import { WsGuard } from '../guard/wsGuard';

export type WsAuthMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const WsAuthMiddleware = (): WsAuthMiddleware => {
  return async (client, next) => {
    try {
      await WsGuard.validateUser(client);
      next();
    } catch (err) {
      next(err);
    }
  };
};
