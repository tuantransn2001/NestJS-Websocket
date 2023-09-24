import { Injectable } from '@nestjs/common';
import { handleConvertUserIDToString } from '../common';
import { API_PATH, STATUS_CODE, STATUS_MESSAGE } from '../ts/enums/api_enums';
import { ObjectType, WsAuthMiddlewarePayload } from '../ts/types/common';
import { Axios } from '../ts/utils/apiRequest';
import { RestFullAPI } from '../ts/utils/apiResponse';
import { errorHandler } from '../ts/utils/errorHandler';
import { HttpException } from '../ts/utils/http.exception';

@Injectable()
class UnibertyService {
  private static async getAdminAccessToken() {
    try {
      const { status, data } = await Axios.createInstance({
        baseURL: process.env.UNIBERTY_BASE_URL,
      }).post(API_PATH.admin_login, {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });

      return RestFullAPI.onSuccess(status, STATUS_MESSAGE.SUCCESS, {
        access_token: data?.access_token,
        token_type: data?.token_type,
      });
    } catch (err) {
      return errorHandler(err);
    }
  }
  private static async getChatToken() {
    try {
      const { data: getAccessTokenResult }: ObjectType =
        await UnibertyService.getAdminAccessToken();
      const { status, data } = await Axios.createInstance({
        baseURL: process.env.UNIBERTY_BASE_URL,
        token: getAccessTokenResult.access_token,
      }).post(API_PATH.get_chat_token);
      return RestFullAPI.onSuccess(status, STATUS_MESSAGE.SUCCESS, data);
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async searchListUser(ids: Record<string, Array<any>>) {
    try {
      const { data: getChatTokenData }: ObjectType =
        await UnibertyService.getChatToken();

      const result = await Axios.createInstance({
        baseURL: process.env.UNIBERTY_BASE_URL,
      }).post(API_PATH.search_list_user, ids, {
        headers: { Authorization: `Bearer ${getChatTokenData.token}` },
      });
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        result,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async searchUserByName(name: string) {
    try {
      const { data: chatTokenData }: ObjectType =
        await UnibertyService.getChatToken();
      const searchUserByNameResult = await Axios.createInstance({
        baseURL: process.env.UNIBERTY_BASE_URL,
      }).get(API_PATH.search_user_by_name, {
        params: { name },
        headers: { Authorization: `Bearer ${chatTokenData.token}` },
      });
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        handleConvertUserIDToString(searchUserByNameResult.data.data),
      );
    } catch (err) {
      return errorHandler(err);
    }
  }

  public async validateToken(payload: WsAuthMiddlewarePayload) {
    return await Axios.createInstance({
      baseURL: process.env.UNIBERTY_BASE_URL,
      token: payload.token,
    })
      .get(`${payload.type}/me`)
      .then(() => RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS))
      .catch(() =>
        RestFullAPI.onFail(STATUS_CODE.UNAUTHORIZED, {
          message: STATUS_MESSAGE.UN_AUTHORIZE,
        } as HttpException),
      );
  }
}
export { UnibertyService };
