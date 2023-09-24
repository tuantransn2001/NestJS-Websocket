import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { MODEL_NAME } from '../ts/enums/common';
import { EVENTS } from './constants/event_constants';
import { RestFullAPI } from '../ts/utils/apiResponse';
import { STATUS_CODE, STATUS_MESSAGE } from '../ts/enums/api_enums';
import { errorHandler } from '../ts/utils/errorHandler';
import {
  DeleteConversationDTO,
  DeleteMessageDTO,
  RequestContactListDTO,
  TypingDTO,
  SearchUserByNameDTO,
  RequestRoomMessageDTO,
  SendRoomMessageDTO,
  JoinRoomDTO,
  EditMessageDTO,
} from './dto/input';

import {
  handleCheckTwoUserIsOne,
  handleGetLastMessage,
  handleGetUniqObjInArr,
} from '../common';
import { map as asyncMap } from 'awaity';
import { UnibertyService } from '../uniberty/uniberty.service';
import {
  handleGetAllMessageByConversationID,
  handleGetFullUserDetailByIDList,
  handleGetAllConversationByMembers,
} from './helper';
import {
  DeleteConversationSchema,
  DeleteMessageSchema,
  JoinRoomSchema,
  RequestContactListSchema,
  RequestMessageSchema,
  SearchUserByNameSchema,
  SendRoomMessageSchema,
  TypingSchema,
  EditMessageSchema,
} from './shared/chat.shema';
import {
  IConversation,
  MemberType,
  MemberTypeArray,
} from './shared/chat.interface';
import { handleErrorNotFound } from '../ts/utils';

@Injectable()
export class ChatService {
  private readonly logger = new Logger();
  constructor(
    @Inject(MODEL_NAME.CONVERSATION)
    private conversationModel: Model<IConversation>,
    private unibertyService: UnibertyService,
  ) {}

  // ? ====================================================
  // ? CLIENT JOIN ROOM
  // ? ====================================================
  public handleClientJoinRoom<D extends JoinRoomDTO, S extends Server>(
    clientJoinRoomDTO: D,
    server: S,
  ) {
    this.logger.log('CLIENT JOIN ROOM', clientJoinRoomDTO);
    try {
      const data = JoinRoomSchema.parse(clientJoinRoomDTO);
      server.sockets.socketsJoin(data.roomID);
      server.sockets.emit(
        EVENTS.SERVER.JOINED_ROOM,
        RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS, {
          message: `user has joined room: ${clientJoinRoomDTO.roomID}`,
        }),
      );
      this.logger.log('CLIENT JOIN ROOM - Successfully!!!');
    } catch (err) {
      server.sockets.emit(EVENTS.SERVER.JOINED_ROOM, errorHandler(err));
      this.logger.log('CLIENT JOIN ROOM - Bad Request!!!', errorHandler(err));
    }
  }
  // ? ====================================================
  // ? CLIENT SEND ROOM MESSAGE
  // ? Case they didn't chat each other before
  // ? ====================================================
  public async handleClientSendRoomMessage<
    D extends SendRoomMessageDTO,
    S extends Server,
  >(sendRoomMessageDTO: D, server: S) {
    this.logger.log(
      `CLIENT SEND ROOM MESSAGE - Case they didn't chat each other before`,
      sendRoomMessageDTO,
    );
    try {
      const data = SendRoomMessageSchema.parse(sendRoomMessageDTO);
      const { conversationID, message } = data;
      await this.conversationModel
        .findOneAndUpdate(
          { id: conversationID },
          {
            $push: { messages: { ...message, id: uuidv4() } },
          },
        )
        .then(async () => {
          const responseConversation =
            await handleGetAllMessageByConversationID(
              this.unibertyService,
              this.conversationModel,
              conversationID,
            );
          server.sockets.emit(
            EVENTS.SERVER.RECEIVE_ROOM_MESSAGE,
            responseConversation,
          );
          this.logger.log(
            `CLIENT SEND ROOM MESSAGE - Case they didn't chat each other before - Successfully!!!`,
            responseConversation,
          );
        })
        .catch((err) => {
          server.sockets.emit(
            EVENTS.SERVER.RECEIVE_ROOM_MESSAGE,
            errorHandler(err),
          );
          this.logger.log(
            `CLIENT SEND ROOM MESSAGE - Case they didn't chat each other before - Fail!!!`,
            errorHandler(err),
          );
        });
    } catch (err) {
      server.sockets.emit(
        EVENTS.SERVER.RECEIVE_ROOM_MESSAGE,
        errorHandler(err),
      );
      this.logger.log(
        `CLIENT SEND ROOM MESSAGE - Case they didn't chat each other before - Bad Request!!!`,
        errorHandler(err),
      );
    }
  }
  // ? ====================================================
  // ? CLIENT SEND FIRST MESSAGE
  // ? Case they did chatted each other before
  // ? ====================================================
  public async handleClientSendFirstRoomMessage<
    D extends SendRoomMessageDTO,
    S extends Server,
  >(sendRoomMessageDTO: D, server: S) {
    this.logger.log(
      `CLIENT SEND ROOM MESSAGE - Case they did chatted each other before`,
      sendRoomMessageDTO,
    );
    try {
      const data = SendRoomMessageSchema.parse(sendRoomMessageDTO);
      const conversationID = uuidv4();
      const { members, message } = data;
      const newConversationDocument: IConversation = {
        id: conversationID,
        members,
        messages: [message],
        name: '',
      };
      await this.conversationModel
        .create(newConversationDocument)
        .then(async (response) => {
          const responseConversation =
            await handleGetAllMessageByConversationID(
              this.unibertyService,
              this.conversationModel,
              conversationID,
            );
          server.sockets.socketsJoin(response.id);
          server.sockets.emit(
            EVENTS.SERVER.RECEIVE_ROOM_MESSAGE,
            responseConversation,
          );
          this.logger.log(
            `CLIENT SEND ROOM MESSAGE - Case they did chatted each other before - Successfully!!!`,
            responseConversation,
          );
        })
        .catch((err) => {
          server.sockets.emit(
            EVENTS.SERVER.RECEIVE_ROOM_MESSAGE,
            errorHandler(err),
          );
          this.logger.log(
            `CLIENT SEND ROOM MESSAGE - Case they did chatted each other before - Fail!!!`,
            errorHandler(err),
          );
        });
    } catch (err) {
      server.sockets.emit(
        EVENTS.SERVER.RECEIVE_ROOM_MESSAGE,
        errorHandler(err),
      );
      this.logger.log(
        `CLIENT SEND ROOM MESSAGE - Case they did chatted each other before - Bad Request!!!`,
        errorHandler(err),
      );
    }
  }
  // ? ====================================================
  // ? DELETE CONVERSATION
  // ? ====================================================
  public async handleDeleteConversation<
    D extends DeleteConversationDTO,
    S extends Server,
  >(deleteMessageDTO: D, server: S) {
    this.logger.log(`DELETE CONVERSATION`, deleteMessageDTO);
    try {
      const data = DeleteConversationSchema.parse(deleteMessageDTO);
      const { id } = data;
      await this.conversationModel
        .updateOne({ id }, { $set: { isDelete: true } })
        .then(() => {
          server.sockets.emit(
            EVENTS.SERVER.DELETE_CONVERSATION_RESULT,
            RestFullAPI.onSuccess(STATUS_CODE.CREATED, STATUS_MESSAGE.SUCCESS),
          );
        })
        .catch((err) => {
          server.sockets.emit(
            EVENTS.SERVER.DELETE_CONVERSATION_RESULT,
            errorHandler(err),
          );
        });
    } catch (err) {
      server.sockets.emit(
        EVENTS.SERVER.DELETE_CONVERSATION_RESULT,
        errorHandler(err),
      );
    }
  }
  // ? ====================================================
  // ? EDIT MESSAGE
  // ? ====================================================
  public async handleEditMessage<D extends EditMessageDTO, S extends Server>(
    editMessageDTO: D,
    server: S,
  ) {
    this.logger.log(`EDIT MESSAGE`, editMessageDTO);
    try {
      const data = EditMessageSchema.parse(editMessageDTO);
      const { messageID, conversationID, dto } = data;

      const foundConversation = await this.conversationModel.findOne({
        id: conversationID,
      });

      if (foundConversation) {
        const sourceMessageUpdateSelector = ({ id }) => id === messageID;

        const targetMessageUpdateIndex = foundConversation.messages.findIndex(
          sourceMessageUpdateSelector,
        );

        if (targetMessageUpdateIndex !== -1) {
          const updateMessageData = {
            ...foundConversation.messages[targetMessageUpdateIndex],
            ...dto,
          };
          foundConversation.messages.splice(
            targetMessageUpdateIndex,
            1,
            updateMessageData,
          );

          await foundConversation.save();

          server.sockets.emit(
            EVENTS.SERVER.EDIT_MESSAGE_RESULT,
            RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS),
          );
          this.logger.log(`EDIT MESSAGE - Successfully!!!}`);
        } else {
          const messageError = `messageID: ${messageID} ${STATUS_MESSAGE.NOT_FOUND}`;
          server.sockets.emit(
            EVENTS.SERVER.EDIT_MESSAGE_RESULT,
            handleErrorNotFound(messageError),
          );
          this.logger.log(`EDIT MESSAGE - Fail!!! - ${messageError}`);
        }
      } else {
        const messageError = `conversationID: ${conversationID} ${STATUS_MESSAGE.NOT_FOUND}`;
        server.sockets.emit(
          EVENTS.SERVER.EDIT_MESSAGE_RESULT,
          handleErrorNotFound(messageError),
        );
        this.logger.log(`EDIT MESSAGE - Fail!!! - ${messageError}`);
      }
    } catch (err) {
      server.sockets.emit(EVENTS.SERVER.EDIT_MESSAGE_RESULT, errorHandler(err));
      this.logger.log(`EDIT MESSAGE - Bad Request!!!`, errorHandler(err));
    }
  }
  // ? ====================================================
  // ? DELETE CONVERSATION
  // ? ====================================================
  public async handleDeleteMessageConversation<
    D extends DeleteMessageDTO,
    S extends Server,
  >(deleteMessageDTO: D, server: S) {
    this.logger.log(`CLIENT DELETE ROOM MESSAGE`, deleteMessageDTO);
    try {
      const data = DeleteMessageSchema.parse(deleteMessageDTO);
      const { conversationID, messageID } = data;
      await this.conversationModel
        .updateOne(
          { id: conversationID, 'messages.id': messageID },
          { $set: { 'messages.$.isDelete': true } },
        )
        .then(() => {
          server.sockets.emit(
            EVENTS.SERVER.DELETE_MESSAGE_RESULT,
            RestFullAPI.onSuccess(STATUS_CODE.CREATED, STATUS_MESSAGE.SUCCESS),
          );
          this.logger.log(`CLIENT DELETE ROOM MESSAGE - Successfully!!!`);
        })
        .catch((err) => {
          server.sockets.emit(
            EVENTS.SERVER.DELETE_MESSAGE_RESULT,
            errorHandler(err),
          );
          this.logger.log(
            `CLIENT DELETE ROOM MESSAGE - Fail!!!`,
            errorHandler(err),
          );
        });
    } catch (err) {
      server.sockets.emit(
        EVENTS.SERVER.DELETE_MESSAGE_RESULT,
        errorHandler(err),
      );
      this.logger.log(
        `CLIENT DELETE ROOM MESSAGE - Bad Request!!!`,
        errorHandler(err),
      );
    }
  }
  // ? ====================================================
  // ? TYPING
  // ? ====================================================
  public async handleTyping<D extends TypingDTO, S extends Server>(
    typingDTO: D,
    server: S,
  ) {
    this.logger.log(`CLIENT TYPING`, typingDTO);
    try {
      const data = TypingSchema.parse(typingDTO);
      const { sender, isTyping } = data;
      server.sockets.emit(
        EVENTS.SERVER.IS_TYPING,
        RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS, {
          sender,
          isTyping,
        }),
      );
      this.logger.log(`CLIENT TYPING - Successfully!!!`);
    } catch (err) {
      server.sockets.emit(EVENTS.SERVER.IS_TYPING, errorHandler(err));
      this.logger.log(`CLIENT TYPING - Bad Request!!!`, errorHandler(err));
    }
  }
  // ? ====================================================
  // ? GET CONTACT LIST
  // ? ====================================================
  public async handleGetContactList<
    D extends RequestContactListDTO,
    S extends Server,
  >(requestContactListDTO: D, server: S) {
    this.logger.log(`GET CONTACT LIST`, requestContactListDTO);
    try {
      const data = RequestContactListSchema.parse(requestContactListDTO);
      const { id, type } = data;
      const foundUserContactList = await this.conversationModel.find(
        {
          members: { $elemMatch: { id, type } },
          isDelete: false,
        },
        {
          isDelete: 0,
          _id: 0,
          'members._id': 0,
        },
      );

      const arrUniqMemberDetail = handleGetUniqObjInArr(
        foundUserContactList
          .map(({ members }) => {
            return [...members];
          })
          .flat(1),
        ['id', 'type'],
      );
      const arrUniqMemberFullDetail = await handleGetFullUserDetailByIDList(
        this.unibertyService,
        arrUniqMemberDetail,
      );

      const handleGetMemberDetailByIdAndType = (members: MemberTypeArray) => {
        return members.reduce((result, member) => {
          const memberFullDetailIndex = arrUniqMemberFullDetail.findIndex(
            (m: MemberType) =>
              handleCheckTwoUserIsOne({ ...m, id: m.id.toString() }, member),
          );

          if (memberFullDetailIndex !== -1) {
            result.push({
              ...arrUniqMemberFullDetail[memberFullDetailIndex],
              id: arrUniqMemberFullDetail[memberFullDetailIndex].id.toString(),
            });
          }

          return result;
        }, []);
      };

      const responseContactList = await asyncMap(
        foundUserContactList,
        async (userContactItem: IConversation) => {
          const {
            id: conversationID,
            members,
            name,
            messages,
            createdAt,
            updatedAt,
          } = userContactItem;

          return {
            conversationID,
            name,
            members: handleGetMemberDetailByIdAndType(members),
            lastMessage: handleGetLastMessage(messages),
            createdAt,
            updatedAt,
          };
        },
      );

      server.emit(
        EVENTS.SERVER.RECEIVE_CONTACT_LIST,
        RestFullAPI.onSuccess(
          STATUS_CODE.OK,
          STATUS_MESSAGE.SUCCESS,
          responseContactList,
        ),
      );
      this.logger.log(
        `GET CONTACT LIST - Successfully!!!`,
        responseContactList,
      );
    } catch (err) {
      server.emit(EVENTS.SERVER.RECEIVE_CONTACT_LIST, errorHandler(err));
      this.logger.log(`GET CONTACT LIST - Bad Request!!!`, errorHandler(err));
    }
  }
  // ? ====================================================
  // ? Get Room Message
  // ? ====================================================
  public async handleGetRoomMessages<
    D extends RequestRoomMessageDTO,
    S extends Server,
  >(requestRoomMessageDTO: D, server: S) {
    this.logger.log(`CLIENT GET ROOM MESSAGE`, requestRoomMessageDTO);
    try {
      const data = RequestMessageSchema.parse(requestRoomMessageDTO);
      const { id, members } = data;
      const isGetByID = members === undefined;
      if (isGetByID) {
        // ? Case choose from contact item
        const responseMessages = await handleGetAllMessageByConversationID(
          this.unibertyService,
          this.conversationModel,
          id,
        );
        server.emit(EVENTS.SERVER.RECEIVE_ROOM_MESSAGE, responseMessages);
        this.logger.log(
          `CLIENT GET ROOM MESSAGE - GetByID - Successfully!!!`,
          responseMessages,
        );
      } else {
        // ? Case choose from search item

        const responseMessages = await handleGetAllConversationByMembers(
          this.unibertyService,
          this.conversationModel,
          members,
        );
        server.emit(EVENTS.SERVER.RECEIVE_ROOM_MESSAGE, responseMessages);
        this.logger.log(
          `CLIENT GET ROOM MESSAGE - GetByMembers - Successfully!!!`,
          responseMessages,
        );
      }
    } catch (err) {
      server.emit(EVENTS.SERVER.RECEIVE_ROOM_MESSAGE, errorHandler(err));
      this.logger.log(
        `CLIENT GET ROOM MESSAGE - Bad Request!!!`,
        errorHandler(err),
      );
    }
  }
  // ? ====================================================
  // ? SEARCH USER BY NAME
  // ? ====================================================
  public async handleSearchUserByName<
    D extends SearchUserByNameDTO,
    S extends Server,
  >(searchUserByNameDTO: D, server: S) {
    this.logger.log(`SEARCH USER BY NAME`, searchUserByNameDTO);
    try {
      const data = SearchUserByNameSchema.parse(searchUserByNameDTO);
      const { name } = data;

      const userListResponse = await this.unibertyService.searchUserByName(
        name,
      );
      server.emit(EVENTS.SERVER.RECEIVE_USER_LIST, userListResponse);
      this.logger.log(
        `SEARCH USER BY NAME - Successfully!!!`,
        userListResponse,
      );
    } catch (err) {
      server.emit(EVENTS.SERVER.RECEIVE_USER_LIST, errorHandler(err));
      this.logger.log(
        `SEARCH USER BY NAME - Bad Request!!!`,
        errorHandler(err),
      );
    }
  }
}
