import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { ModelName } from '../common/enums/common';
import { EVENTS } from './constants/event';
import { RestFullAPI } from '../utils/apiResponse';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api.enum';
import { errorHandler } from '../utils/errorHandler';

import { map as asyncMap } from 'awaity';
import {
  handleGetPagination,
  handleCheckTwoUserIsOne,
  handleGetLastMessage,
  handleGetUniqObjInArr,
} from './helper';
import {
  IConversation,
  MemberType,
  MemberTypeArray,
} from './shared/chat.common.interface';
import { handleErrorNotFound } from '../utils';
import { MessageService } from './message.service';
import { JoinRoomDTO } from './dto/input/join-room.dto';
import { SendRoomMessageDTO } from './dto/input/send-room-message.dto';
import { DeleteConversationDTO } from './dto/input/delete-conversation.dto';
import { EditMessageDTO } from './dto/input/edit-message.dto';
import { DeleteMessageDTO } from './dto/input/delete-message.dto';
import { TypingDTO } from './dto/input/typing.dto';
import { RequestContactListDTO } from './dto/input/request-contact-list.dto';
import { RequestRoomMessageDTO } from './dto/input/request-room-message.dto';
import { SearchUserByNameDTO } from './dto/input/search-user-by-name.dto';
import { IUserRepository } from '../user/repository/iuser.repository';

@Injectable()
export class ChatService {
  private readonly logger = new Logger();
  constructor(
    @Inject(ModelName.CONVERSATION)
    private readonly conversationModel: Model<IConversation>,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    private readonly messageService: MessageService,
  ) {}

  // ? ====================================================
  // ? CLIENT JOIN ROOM
  // ? ====================================================
  public handleClientJoinRoom(clientJoinRoomDTO: JoinRoomDTO, server: Server) {
    this.logger.log('CLIENT JOIN ROOM', clientJoinRoomDTO);
    try {
      const { roomID } = clientJoinRoomDTO;
      server.sockets.socketsJoin(roomID);
      server.sockets.emit(
        EVENTS.SERVER.JOINED_ROOM,
        RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS, {
          message: `user has joined room: ${clientJoinRoomDTO.roomID}`,
        }),
      );
      this.logger.log('CLIENT JOIN ROOM - Successfully!!!');
    } catch (err) {
      server.sockets.emit(EVENTS.SERVER.JOINED_ROOM, errorHandler(err));
      this.logger.log(
        'CLIENT JOIN ROOM - INTERNAL SERVER ERROR!!!',
        errorHandler(err),
      );
    }
  }
  // ? ====================================================
  // ? CLIENT SEND ROOM MESSAGE
  // ? Case they did chat each other before
  // ? ====================================================
  public async handleClientSendRoomMessage(payload: SendRoomMessageDTO) {
    try {
      const { conversationID, message } = payload;

      await this.conversationModel.findOneAndUpdate(
        { id: conversationID },
        {
          $push: {
            messages: { ...message, id: uuidv4() },
          },
        },
      );

      const responseConversation =
        await this.messageService.handleGetAllMessageByConversationID(
          this.conversationModel,
          conversationID,
        );

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        responseConversation,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? CLIENT SEND FIRST MESSAGE
  // ? Case they didn't chatted each other before
  // ? ====================================================
  public async handleClientSendFirstRoomMessage(payload: SendRoomMessageDTO) {
    try {
      const { members, message } = payload;
      const conversationID = uuidv4();
      const newConversationDocument: IConversation = {
        id: conversationID,
        members,
        messages: [message],
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const response = await this.conversationModel.create(
        newConversationDocument,
      );
      const responseConversation =
        await this.messageService.handleGetAllMessageByConversationID(
          this.conversationModel,
          response.id,
        );
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        responseConversation,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? DELETE CONVERSATION
  // ? ====================================================
  public async handleDeleteConversation(payload: DeleteConversationDTO) {
    try {
      const { id } = payload;

      await this.conversationModel.updateOne(
        { id },
        { $set: { isDelete: true } },
      );

      return RestFullAPI.onSuccess(STATUS_CODE.CREATED, STATUS_MESSAGE.SUCCESS);
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? EDIT MESSAGE
  // ? ====================================================
  public async handleEditMessage(payload: EditMessageDTO) {
    try {
      const { messageID, conversationID, dto } = payload;

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

          return RestFullAPI.onSuccess(
            STATUS_CODE.ACCEPTED,
            STATUS_MESSAGE.SUCCESS,
          );
        } else {
          const messageError = `messageID: ${messageID} ${STATUS_MESSAGE.NOT_FOUND}`;
          return handleErrorNotFound(messageError);
        }
      } else {
        const messageError = `conversationID: ${conversationID} ${STATUS_MESSAGE.NOT_FOUND}`;

        return handleErrorNotFound(messageError);
      }
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? DELETE CONVERSATION
  // ? ====================================================
  public async handleDeleteMessageConversation(payload: DeleteMessageDTO) {
    try {
      const { conversationID, messageID } = payload;

      await this.conversationModel.updateOne(
        { id: conversationID, 'messages.id': messageID },
        { $set: { 'messages.$.isDelete': true } },
      );

      return RestFullAPI.onSuccess(STATUS_CODE.CREATED, STATUS_MESSAGE.SUCCESS);
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? TYPING
  // ? ====================================================
  public async handleTyping(payload: TypingDTO) {
    try {
      const { sender, isTyping } = payload;

      return RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS, {
        sender,
        isTyping,
      });
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? GET CONTACT LIST
  // ? ====================================================
  public async handleGetContactList(payload: RequestContactListDTO) {
    try {
      const { sort, pagination } = payload;
      const { id, type } = sort;

      const { _skip, _limit } = handleGetPagination(pagination);

      const foundUserContactList = await this.conversationModel
        .find(
          {
            members: { $elemMatch: { id, type } },
            isDelete: false,
          },
          {
            isDelete: 0,
            _id: 0,
            'members._id': 0,
          },
        )
        .skip(_skip)
        .limit(_limit);

      const arrUniqMemberDetail = handleGetUniqObjInArr(
        foundUserContactList.map(({ members }) => members).flat(1),
        ['id', 'type'],
      );

      const arrUniqMemberFullDetail =
        await this.messageService.handleGetFullUserDetailByIDList(
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
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        responseContactList,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? GET ROOM MESSAGE
  // ? ====================================================
  public async handleGetRoomMessages(payload: RequestRoomMessageDTO) {
    try {
      const { sort } = payload;
      const { id, members } = sort;

      const isGetByID = members === undefined;
      if (isGetByID) {
        // ? Case choose from contact item
        const responseMessages =
          await this.messageService.handleGetAllMessageByConversationID(
            this.conversationModel,
            id,
          );
        return RestFullAPI.onSuccess(
          STATUS_CODE.OK,
          STATUS_MESSAGE.SUCCESS,
          responseMessages,
        );
      } else {
        // ? Case choose from search item
        const responseMessages =
          await this.messageService.handleGetAllConversationByMembers(
            this.conversationModel,
            members,
          );
        return RestFullAPI.onSuccess(
          STATUS_CODE.OK,
          STATUS_MESSAGE.SUCCESS,
          responseMessages,
        );
      }
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? SEARCH USER BY NAME
  // ? ====================================================
  public async handleSearchUserByName(payload: SearchUserByNameDTO) {
    try {
      const { name } = payload;

      const userListResponse = await this.userRepository.searchUserByName({
        offset: 1,
        limit: 10,
        name: name,
        idsToSkip: 0,
      });
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        userListResponse,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  // ? ====================================================
  // ? BLOCK
  // ? ====================================================
  public handleBlockUser() {
    this.logger.log(`Block user`);
  }
  // ? ====================================================
  // ? FORWARD
  // ? ====================================================
  public handleForwardMessage() {
    this.logger.log(`Forward message`);
  }
}
