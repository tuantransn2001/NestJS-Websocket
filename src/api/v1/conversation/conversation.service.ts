import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { asyncMap } from '../common';
import { MembersDTO } from '../ts/dto/conversation.dto';
import { STATUS_CODE, STATUS_MESSAGE } from '../ts/enums/api_enums';
import { MODEL_NAME } from '../ts/enums/model_enums';
import { Conversation, Member } from '../ts/interfaces/common';
import { ObjectType } from '../ts/types/common';
import { RestFullAPI } from '../ts/utils/apiResponse';
import { HttpException } from '../ts/utils/http.exception';
import { UnibertyServices } from '../uniberty/uniberty.service';
@Injectable()
export class ConversationServices {
  constructor(
    @Inject(MODEL_NAME.CONVERSATION)
    private conversationModel: Model<Conversation>,
    private unibertyServices: UnibertyServices,
  ) {}

  public async getByMembers(membersData: MembersDTO) {
    try {
      const foundConversation = await this.conversationModel.findOne({
        members: {
          $elemMatch: membersData.members[0] && membersData.members[1],
        },
      });

      return RestFullAPI.onSuccess(
        STATUS_CODE.STATUS_CODE_200,
        STATUS_MESSAGE.SUCCESS,
        foundConversation,
      );
    } catch (err) {
      return RestFullAPI.onFail(STATUS_CODE.STATUS_CODE_500, {
        message: err.message,
      } as HttpException);
    }
  }
  public async handleFormatUserContactInfo(id: string, members: Member[]) {
    const IDList: ObjectType = members
      .filter((member: Member) => {
        const inputID: string = id;
        return member.id.toString() !== inputID;
      })
      .reduce(
        (IdListResult: ObjectType, member: Member) => {
          const currentUserType = member.type as keyof ObjectType;
          const currentUserID: number = +member.id as number;

          IdListResult.ids[currentUserType].push(currentUserID);

          return IdListResult;
        },
        {
          ids: { student: [], admissions_officer: [], admin: [] },
        },
      ) as ObjectType;

    const { data }: ObjectType = (await this.unibertyServices.searchListUser(
      IDList,
    )) as Record<string, any>;

    return data;
  }

  public async getContactList({ id, type }: Member) {
    try {
      const foundUserContactList = await this.conversationModel.find({
        members: { $elemMatch: { id, type } },
      });

      return RestFullAPI.onSuccess(
        STATUS_CODE.STATUS_CODE_200,
        STATUS_MESSAGE.SUCCESS,
        await asyncMap(foundUserContactList, async (userContactItem: any) => {
          const { id: conversationID, members, messages } = userContactItem;
          return {
            conversationID,
            members: await this.handleFormatUserContactInfo(id, members),
            messages,
          };
        }),
      );
    } catch (err) {
      return RestFullAPI.onFail(STATUS_CODE.STATUS_CODE_500, {
        message: err.message,
      } as HttpException);
    }
  }
}
