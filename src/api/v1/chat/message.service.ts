/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { filter as asyncFilter, reduce as asyncReduce } from 'awaity';
import {
  ConversationTypeArray,
  IConversation,
  MemberType,
  MemberTypeArray,
  MessageType,
} from './shared/chat.interface';
import { isEmpty } from '../common';
import { Model } from 'mongoose';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';

import { ObjectType } from '../common/types/common';
import { UserService } from '../user/user.service';
import { isSingleChat } from './helper';

@Injectable()
export class MessageService {
  constructor(private readonly userService: UserService) {}

  public async handleFilterMessageAlreadyExist(messages: MemberType[]) {
    if (isEmpty(messages)) return [];

    const existMessages = await asyncReduce(
      messages,
      async (
        messList: MessageType[],
        { content, sender, isDelete, id, createdAt, updatedAt }: MessageType,
      ) => {
        if (!isDelete) {
          const senderDetail = await this.userService.findUniq(sender.id);

          messList.push({
            id,
            content,
            sender: senderDetail?.toDto(),
            createdAt,
            updatedAt,
          });
        }

        return messList;
      },
      [],
    );

    return existMessages;
  }

  public async handleGetAllConversationByMembers(
    conversationModel: Model<IConversation>,
    members: MemberTypeArray,
  ) {
    try {
      const queryCondition = members.map(({ id, type }) => ({
        [`members.id`]: id,
        [`members.type`]: type,
      }));
      // ? This include multiple , members > 3
      const foundConversation: IConversation[] =
        await conversationModel.aggregate([
          {
            $match: {
              $and: queryCondition,
            },
          },
          {
            $project: {
              _id: 0,
              isDelete: 0,
              'members._id': 0,
            },
          },
        ]);

      if (isEmpty(foundConversation)) return [];

      const foundSingleConversation = foundConversation.find(({ members }) =>
        isSingleChat(members),
      );

      const response = {
        ...foundSingleConversation,
        members: await this.handleGetFullUserDetailByIDList(
          foundSingleConversation.members,
        ),
        messages: await this.handleFilterMessageAlreadyExist(
          foundSingleConversation.messages,
        ),
      };

      return response;
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async handleGetAllMessageByConversationID(
    ConversationModel: Model<IConversation>,
    id: string,
  ) {
    try {
      const foundConversation = await ConversationModel.findOne(
        {
          id,
          isDelete: false,
        },
        {
          __v: 0,
          isDelete: 0,
          _id: 0,
          'messages._id': 0,
        },
      );

      if (!isEmpty(foundConversation)) {
        const responseData = {
          conversationID: id,
          members: await this.handleGetFullUserDetailByIDList(
            foundConversation.members,
          ),
          messages: await this.handleFilterMessageAlreadyExist(
            foundConversation.messages,
          ),
        };

        return responseData;
      } else {
        return handleErrorNotFound(STATUS_MESSAGE.NOT_FOUND);
      }
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async handleGetFullUserDetailByIDList(members: MemberTypeArray) {
    if (isEmpty(members)) {
      return [];
    } else {
      const IDList: any = members.reduce(
        (IdListResult: ObjectType, member: MemberType) => {
          const currentUserType = member.type as keyof ObjectType;
          const currentUserID = member.id;

          IdListResult.ids[currentUserType].push(currentUserID);

          return IdListResult;
        },
        {
          ids: { admin: [], user: [], guest: [] },
        },
      ) as ObjectType;

      const result: ObjectType = (await this.userService.searchListUser(
        IDList,
      )) as ObjectType;

      return Object.entries(result)
        .map(([_, users]) => users)
        .flat(1);
    }
  }
}
