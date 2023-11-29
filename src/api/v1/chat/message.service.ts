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
import {
  HttpException,
  RestFullAPI,
  errorHandler,
  handleErrorNotFound,
} from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';

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
        messList,
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

  public handleGetAllConversationByMembers = async (
    conversationModel: Model<IConversation>,
    members: MemberTypeArray,
  ) => {
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

      const foundSingleConversation = foundConversation.find(({ members }) =>
        isSingleChat(members),
      );

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        isEmpty(foundSingleConversation)
          ? {}
          : {
              ...foundSingleConversation,
              members: await this.handleGetFullUserDetailByIDList(
                foundSingleConversation.members,
              ),
              messages: await this.handleFilterMessageAlreadyExist(
                foundSingleConversation.messages,
              ),
            },
      );
    } catch (err) {
      return errorHandler(err);
    }
  };
  public handleGetAllMessageByConversationID = async (
    ConversationModel: Model<IConversation>,
    id: string,
  ) => {
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

        return RestFullAPI.onSuccess(
          STATUS_CODE.OK,
          STATUS_MESSAGE.SUCCESS,
          responseData,
        );
      } else {
        return handleErrorNotFound(STATUS_MESSAGE.NOT_FOUND);
      }
    } catch (err) {
      return errorHandler(err);
    }
  };
  public handleGetFullUserDetailByIDList = async (members: MemberTypeArray) => {
    if (isEmpty(members)) {
      return [];
    } else {
      const IDList: any = members.reduce(
        (IdListResult: object, member: MemberType) => {
          const currentUserType = member.type as keyof object;
          const currentUserID = member.id;

          IdListResult.ids[currentUserType].push(currentUserID);

          return IdListResult;
        },
        {
          ids: { admin: [], user: [], guest: [] },
        },
      ) as object;

      const result: object = (await this.userService.searchListUser(
        IDList,
      )) as object;

      return Object.entries(result)
        .map(([_, users]) => users)
        .flat(1);
    }
  };
}
