import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { USER_TYPE } from '../../ts/enums/common';
import { Axios } from '../../ts/utils';

export type WsAuthMiddlewarePayload = {
  token: string;
  type: USER_TYPE;
};

@Injectable()
export class WsGuard implements CanActivate {
  private readonly logger = new Logger();

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('WsGuard canActivate is working!!!');
    if (context.getType() !== 'ws') return true;
    const client: Socket = context.switchToWs().getClient<Socket>();
    WsGuard.validateUser(client);
    return true;
  }

  public static async validateUser(client: Socket) {
    const token: string = client.handshake?.headers?.authorization as string;
    return await Axios.createInstance({
      baseURL: process.env.UNIBERTY_BASE_URL,
      token: token,
    }).get(`/api/${USER_TYPE.ADMIN}/me`);
  }
}
