import { ObjectType } from './types/common';
import { UserType } from '../chat/shared/chat.interface';
import { IHealthCheck } from '../health-check/shared/healthCheck.interface';

export const isEmpty = (target: ObjectType | any[]): boolean => {
  return target instanceof Array
    ? target.length === 0
    : target === undefined || target === null
    ? true
    : Object.keys(target).length === 0;
};

export const healthCheck: IHealthCheck = {
  uptime: process.uptime(),
  timestamp: Date.now(),
  message: 'OK',
};
export const handleConvertUserIDToString = (users: UserType[]) =>
  users.map((u) => ({ ...u, id: u.id.toString() }));
