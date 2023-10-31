import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Logger, UseGuards } from '@nestjs/common';
import { Server as SocketServer, Socket } from 'socket.io';
import { EVENTS } from './constants/event_constants';
import { ChatService } from './chat.service';
import {
  JoinRoomDTO,
  SendRoomMessageDTO,
  TypingDTO,
  DeleteMessageDTO,
  DeleteConversationDTO,
  RequestRoomMessageDTO,
  RequestContactListDTO,
  SearchUserByNameDTO,
  EditMessageDTO,
} from './dto/input';
import { WsGuard } from '../common/guard/wsGuard';
import { WsAuthMiddleware } from '../common/middleware/wsAuthMiddleware';

@UseGuards(WsGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger();
  @WebSocketServer()
  webSocketServer: SocketServer;
  constructor(private chatService: ChatService) {}
  // ? ====================================================
  // ? ===================== CONNECT ====================== /* =>> Done
  // ? ====================================================
  public async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`⚡: Client is connected { id: ${client.id} }`);
  }
  // ? ====================================================
  // ? ==================== DISCONNECT ==================== /* =>> Done
  // ? ====================================================
  public handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`⚡️: Client disconnected { id: ${client.id} }`);
  }
  // ? ====================================================
  // ? ==================== AUTHENTICATE ================== /* =>> Done
  // ? ====================================================
  public afterInit(client: Socket) {
    // * Server will check client is allowed to access the server or not here...
    // ? If accepted -> continuing...
    // ! If not accepted -> throw an error back to client using server socket emit
    this.logger.log(`⚡️: Client is authenticating...`);
    client.use(WsAuthMiddleware() as any);
  }
  // ? ====================================================
  // ? ==================== JOIN ROOM ===================== /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.JOIN_ROOM)
  public listenClientJoinRoom(@MessageBody() clientJoinRoomDTO: JoinRoomDTO) {
    return this.chatService.handleClientJoinRoom(
      clientJoinRoomDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? ================ SEND ROOM MESSAGE ================= /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.SEND_ROOM_MESSAGE)
  public async listenClientSendRoomMessage(
    @MessageBody() clientSendRoomMessDTO: SendRoomMessageDTO,
  ) {
    const isConversationExist =
      clientSendRoomMessDTO.hasOwnProperty('conversationID') &&
      clientSendRoomMessDTO.conversationID !== '';
    if (isConversationExist) {
      return await this.chatService.handleClientSendRoomMessage(
        clientSendRoomMessDTO,
        this.webSocketServer,
      );
    } else {
      return await this.chatService.handleClientSendFirstRoomMessage(
        clientSendRoomMessDTO,
        this.webSocketServer,
      );
    }
  }
  // ? ====================================================
  // ? ===================== TYPING ======================= /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.TYPING)
  public async listenUserTyping(@MessageBody() typingDTO: TypingDTO) {
    return this.chatService.handleTyping(typingDTO, this.webSocketServer);
  }
  // ? ====================================================
  // ? ================= DELETE MESSAGE =================== /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.DELETE_MESSAGE)
  public async listenUserDeleteMessageByID(
    @MessageBody() deleteMessageDTO: DeleteMessageDTO,
  ) {
    return await this.chatService.handleDeleteMessageConversation(
      deleteMessageDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? =============== DELETE CONVERSATION ================ /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.DELETE_CONVERSATION)
  public async listenUserDeleteConversationByID(
    @MessageBody() deleteConversationDTO: DeleteConversationDTO,
  ) {
    return await this.chatService.handleDeleteConversation(
      deleteConversationDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? ================ REQUEST ROOM MESSAGE ============== /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.REQUEST_ROOM_MESSAGE)
  public async listenClientRequestRoomMessages(
    @MessageBody() requestRoomMessageDTO: RequestRoomMessageDTO,
  ) {
    return await this.chatService.handleGetRoomMessages(
      requestRoomMessageDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? =============== REQUEST CONTACT LIST =============== /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.REQUEST_CONTACT_LIST)
  public async listenClientRequestContactList(
    @MessageBody() requestContactListDTO: RequestContactListDTO,
  ) {
    return await this.chatService.handleGetContactList(
      requestContactListDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? ==================== SEARCH USER =================== /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.REQUEST_USER_LIST)
  public async listenClientRequestUserList(
    @MessageBody() searchUserByNameDTO: SearchUserByNameDTO,
  ) {
    return await this.chatService.handleSearchUserByName(
      searchUserByNameDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? ==================== EDIT MESSAGE ================== /* =>> DONE
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.EDIT_MESSAGE)
  public async listenClientEditMessage(
    @MessageBody() editMessageDTO: EditMessageDTO,
  ) {
    return await this.chatService.handleEditMessage(
      editMessageDTO,
      this.webSocketServer,
    );
  }
  // ? ====================================================
  // ? ===================== BLOCK USER =================== /* =>> DOING
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.BLOCK)
  public async listenClientBlock() {
    return this.chatService.handleBlockUser();
  }
  // ? ====================================================
  // ? =================== FORWARD MESSAGE ================ /* =>> DOING
  // ? ====================================================
  @SubscribeMessage(EVENTS.CLIENT.BLOCK)
  public async listenClientForwardMessage() {
    return this.chatService.handleForwardMessage();
  }
}
