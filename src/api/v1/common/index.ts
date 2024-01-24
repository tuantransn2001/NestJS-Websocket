import { ObjectType } from './types/common';
import { IHealthCheck } from '../health-check/shared/healthCheck.interface';
import * as moment from 'moment';

export const isEmpty = (target: ObjectType | any[] | string): boolean => {
  if (!target) return true;
  if (target instanceof String) return target.length === 0;
  if (target instanceof Array) return target.length === 0;
  if (target instanceof Object) return Object.keys(target).length === 0;
};

export const getCurrentTime = () => new Date(moment().format('lll'));

export const healthCheck: IHealthCheck = {
  uptime: process.uptime(),
  timestamp: getCurrentTime(),
  message: 'OK',
};
