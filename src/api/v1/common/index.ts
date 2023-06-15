import { HealthCheck, ObjectType } from '../ts/types/common';

export const isEmpty = (target: ObjectType | any): boolean => {
  return target instanceof Array
    ? target.length === 0
    : target === undefined || target === null
    ? true
    : Object.keys(target).length === 0;
};

const asyncMap = async (arr: any[], callback: (item: any) => any) => {
  return Promise.all(arr.map(async (item) => await callback(item)));
};

const healthCheck: HealthCheck = {
  uptime: process.uptime(),
  timestamp: Date.now(),
  message: 'OK',
};

export { asyncMap, healthCheck };
