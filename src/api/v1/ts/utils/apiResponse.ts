import { STATUS_CODE } from '../enums/api_enums';
import { HttpException } from './http.exception';
export class RestFullAPI {
  public data: any;
  public message: string;
  public statusCode: number;

  constructor() {
    this.data = {};
    this.message = '';
    this.statusCode = STATUS_CODE.OK;
  }

  public static onSuccess(statusCode: number, message: string, data?: any) {
    return { statusCode, message, data };
  }

  public static onFail(statusCode: number, error: HttpException) {
    return {
      statusCode,
      error: error,
    };
  }
}
