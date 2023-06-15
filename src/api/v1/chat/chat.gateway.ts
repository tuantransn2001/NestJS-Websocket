import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EVENTS } from '../constants/event_constants';
import { ClientSendRoomMessDTO } from '../ts/dto/conversation.dto';
import { ObjectType } from '../ts/types/common';
import { ChatService } from './chat.service';
@WebSocketGateway(80, { cors: true })
class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private chatService: ChatService) {}
  // ? ====================================================
  // ? ===================== CONNECT ======================
  // ? ====================================================
  handleConnection(client: Socket) {
    console.log(`Client is connected id: ${client.id}`);
    // * Handle logic....
  }
  // ? ====================================================
  // ? ==================== DISCONNECT ====================
  // ? ====================================================
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected id: ${client.id}`);
    // * Handle logic....
  }
  // ? ====================================================
  // ? ==================== JOIN ROOM =====================
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.JOIN_ROOM)
  listenClientJoinRoom(@MessageBody() { roomID }: ObjectType) {
    this.chatService.handleClientJoinRoom({ roomID }, this.server);
  }
  // ? ====================================================
  // ? ================ SEND FIRST MESSAGE ================
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.SEND_FIRST_MESSAGE)
  async listenClientSendFirstMessage(
    @MessageBody() clientFirstMessageData: ClientSendRoomMessDTO,
  ) {
    await this.chatService.handleClientSendFirstRoomMessage(
      clientFirstMessageData,
      this.server,
    );
  }
  // ? ====================================================
  // ? ================ SEND ROOM MESSAGE =================
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.SEND_ROOM_MESSAGE)
  async listenClientSendRoomMessage(
    @MessageBody() clientRoomMessageData: ClientSendRoomMessDTO,
  ) {
    await this.chatService.handleClientSendRoomMessage(
      clientRoomMessageData,
      this.server,
    );
  }
}
export { ChatGateway };
