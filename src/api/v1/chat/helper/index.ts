import { MemberType, MessageTypeArray } from '../shared/chat.common.interface';
import { IUser } from '../../user/shared/user.interface';
import { IPagination } from '../../common/shared/common.interface';

export const handleConvertUserIDToString = (users: IUser[]) =>
  users.map((u) => ({ ...u, id: u.id.toString() }));

export const handleGetUniqObjInArr = (arr: any[], properties: string[]) => [
  ...new Map(
    arr.map((v) => [JSON.stringify(properties.map((k) => v[k])), v]),
  ).values(),
];

export const handleCheckTwoUserIsOne = (
  sender: MemberType,
  compareUser: MemberType,
) => {
  return sender.id === compareUser.id && sender.type === compareUser.type;
};

export const isSingleChat = (member: MemberType[]) => member.length <= 2;

export const handleGetLastMessage = (messages: MessageTypeArray) => {
  const { content, updatedAt: timeMessage } = messages[messages.length - 1];

  return { content, timeMessage };
};

export const handleGetPagination = (payload: IPagination) => {
  if (!payload) return { _skip: 0, _limit: 10 };

  const _skip = (payload.page_number - 1) * payload.page_size;
  const _limit = payload.page_size;

  return { _skip, _limit };
};
