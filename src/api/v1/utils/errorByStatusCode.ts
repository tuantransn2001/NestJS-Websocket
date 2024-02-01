import { STATUS_CODE } from '../common/enums/api.enum';
import { RestFullAPI } from './apiResponse';
import { HttpException } from './http.exception';

export const handleErrorNotFound = (errorMessage: string) => {
  return RestFullAPI.onFail(STATUS_CODE.NOT_FOUND, {
    message: errorMessage,
  } as HttpException);
};
