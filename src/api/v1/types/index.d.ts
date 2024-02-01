import { HttpException } from 'src/api/v1/utils';

declare global {
  export type ObjectType = Record<string, any>;
  export type ArrayType = any[];
  export type HttpExceptionError = {
    status: string;
    error: HttpException;
  };
  export type FindAllResponse<T> = { count: number; items: T[] };
}
