import { HealthCheck, ObjectType } from '../ts/types/common';
import {
  MemberType,
  MessageType,
  MessageTypeArray,
  UserType,
} from '../chat/shared/chat.interface';

export const isEmpty = (target: ObjectType | any[]): boolean => {
  return target instanceof Array
    ? target.length === 0
    : target === undefined || target === null
    ? true
    : Object.keys(target).length === 0;
};

export const healthCheck: HealthCheck = {
  uptime: process.uptime(),
  timestamp: Date.now(),
  message: 'OK',
};

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

export const handleConvertUserIDToString = (users: UserType[]) =>
  users.map((u) => ({ ...u, id: u.id.toString() }));

export const handleFilterMessageAlreadyExist = (messages: MemberType[]) => {
  return isEmpty(messages)
    ? []
    : messages.reduce(
        (
          messList,
          { content, sender, isDelete, id, createdAt, updatedAt }: MessageType,
        ) => {
          !isDelete &&
            messList.push({
              id,
              content,
              sender,
              createdAt,
              updatedAt,
            });

          return messList;
        },
        [],
      );
};

export const handleGetLastMessage = (messages: MessageTypeArray) => {
  const { content, updatedAt: timeMessage } = messages[messages.length - 1];

  return { content, timeMessage };
};
