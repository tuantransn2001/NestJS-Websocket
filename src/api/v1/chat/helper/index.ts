import { Model } from 'mongoose';
import {
  handleConvertUserIDToString,
  handleFilterMessageAlreadyExist,
  handleGetLastMessage,
  isEmpty,
  isSingleChat,
} from '../../common';
import { STATUS_CODE, STATUS_MESSAGE } from '../../ts/enums/api_enums';
import { errorHandler, HttpException, RestFullAPI } from '../../ts/utils';
import { UnibertyService } from '../../uniberty/uniberty.service';
import {
  ConversationTypeArray,
  IConversation,
  MemberType,
  MemberTypeArray,
} from '../shared/chat.interface';
import { async as asyncFilter } from 'awaity';
import { ObjectType } from '../../ts/types/common';
export const handleGetAllConversationByMembers = async (
  unibertyService: UnibertyService,
  conversationModel: Model<IConversation>,
  members: MemberTypeArray,
) => {
  try {
    const queryCondition = members.map(({ id, type }) => ({
      [`members.id`]: id,
      [`members.type`]: type,
    }));
    // ? This include multiple , members > 3
    const foundConversation = await conversationModel.aggregate([
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
    if (isEmpty(foundConversation)) {
      return RestFullAPI.onFail(STATUS_CODE.NOT_FOUND, {
        message: STATUS_MESSAGE.NOT_FOUND,
      } as HttpException);
    } else {
      const foundSingleConversation = await asyncFilter(
        foundConversation,
        async ({ members }: IConversation) => isSingleChat(members),
      ).then(async (conversationRes: ConversationTypeArray) => {
        const {
          id: conversationID,
          members,
          messages,
          createdAt,
          updatedAt,
        } = conversationRes[0];
        return {
          conversationID,
          members: handleConvertUserIDToString(
            await handleGetFullUserDetailByIDList(unibertyService, members),
          ),
          messages: handleFilterMessageAlreadyExist(messages),
          lastMessage: handleGetLastMessage(messages),
          createdAt,
          updatedAt,
        };
      });

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        foundSingleConversation,
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
};
export const handleGetAllMessageByConversationID = async (
  unibertyService: UnibertyService,
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
        members: handleConvertUserIDToString(
          await handleGetFullUserDetailByIDList(
            unibertyService,
            foundConversation.members,
          ),
        ),
        messages: handleFilterMessageAlreadyExist(foundConversation.messages),
      };

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        responseData,
      );
    } else {
      return RestFullAPI.onFail(STATUS_CODE.NOT_FOUND, {
        message: STATUS_MESSAGE.NOT_FOUND,
      } as HttpException);
    }
  } catch (err) {
    return errorHandler(err);
  }
};
export const handleGetFullUserDetailByIDList = async (
  unibertyService: UnibertyService,
  members: MemberTypeArray,
) => {
  if (isEmpty(members)) {
    return [];
  } else {
    const IDList: ObjectType = members.reduce(
      (IdListResult: ObjectType, member: MemberType) => {
        const currentUserType = member.type as keyof ObjectType;
        const currentUserID: number = +member.id as number;

        IdListResult.ids[currentUserType].push(currentUserID);

        return IdListResult;
      },
      {
        ids: { student: [], admissions_officer: [], admin: [] },
      },
    ) as ObjectType;

    const result: ObjectType = (await unibertyService.searchListUser(
      IDList,
    )) as ObjectType;
    return result.data.data;
  }
};
