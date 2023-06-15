import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { ClientSendRoomMessDTO } from '../ts/dto/conversation.dto';
import { MODEL_NAME } from '../ts/enums/model_enums';
import { Conversation } from '../ts/interfaces/common';
import { ObjectType } from '../ts/types/common';
import { EVENTS } from '../constants/event_constants';
import RestFullAPI from '../ts/utils/apiResponse';
import { STATUS_CODE, STATUS_MESSAGE } from '../ts/enums/api_enums';

@Injectable()
class ChatService {
  constructor(
    @Inject(MODEL_NAME.CONVERSATION)
    private conversationModel: Model<Conversation>,
  ) {}

  // ? ====================================================
  // ? CLIENT JOIN ROOM
  // ? ====================================================
  handleClientJoinRoom<D extends ObjectType, S extends Server>(
    { roomID }: D,
    server: S,
  ): void {
    server.sockets.socketsJoin(roomID);

    server.emit(
      EVENTS.SERVER.JOINED_ROOM,
      RestFullAPI.onSuccess(
        STATUS_CODE.STATUS_CODE_200,
        STATUS_MESSAGE.SUCCESS,
        { roomID },
      ),
    );
  }
  // ? ====================================================
  // ? CLIENT SEND ROOM MESSAGE
  // ? Case they didn't chat each other before
  // ? ====================================================
  async handleClientSendRoomMessage<
    D extends ClientSendRoomMessDTO,
    S extends Server,
  >({ conversationID, message }: D, server: S) {
    const updatedConversation = await this.conversationModel.findOneAndUpdate(
      { id: conversationID },
      {
        $push: { messages: message },
      },
    );
    server.emit(
      EVENTS.SERVER.RECEIVED_ROOM_MESSAGE,
      RestFullAPI.onSuccess(
        STATUS_CODE.STATUS_CODE_200,
        STATUS_MESSAGE.SUCCESS,
        {
          updated_conversation: {
            id: updatedConversation.id,
            members: updatedConversation.members,
            message: updatedConversation.messages,
          },
        },
      ),
    );
  }
  // ? ====================================================
  // ? CLIENT SEND FIRST MESSAGE
  // ? Case they did chatted each other before
  // ? ====================================================
  async handleClientSendFirstRoomMessage<
    D extends ClientSendRoomMessDTO,
    S extends Server,
  >({ members, message }: D, server: S) {
    const newConversationDocument: Conversation = {
      id: uuidv4(),
      members,
      messages: [message],
      name: '',
    };
    const createdConversation = await this.conversationModel.create(
      newConversationDocument,
    );
    server.socketsJoin(newConversationDocument.id);
    server.emit(
      EVENTS.SERVER.RECEIVED_FIRST_MESSAGE,
      RestFullAPI.onSuccess(
        STATUS_CODE.STATUS_CODE_200,
        STATUS_MESSAGE.SUCCESS,
        {
          created_conversation: {
            id: createdConversation.id,
            members: createdConversation.members,
            message: createdConversation.messages,
          },
        },
      ),
    );
  }
}

export { ChatService };
