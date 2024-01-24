import { HttpException } from '../../utils';

export type ObjectType = Record<string, any>;

export type HttpExceptionError = {
  status: string;
  error: HttpException;
};
