import { Injectable } from '@nestjs/common';
import {
  API_PATH,
  API_RESPONSE_STATUS,
  API_STUFF,
} from '../ts/enums/api_enums';
import RestFullAPIRequest from '../ts/utils/apiRequest';
import HttpException from '../ts/utils/http.exception';

@Injectable()
class UnibertyServices {
  async searchListUser(ids: Record<string, Array<any>>) {
    try {
      const searchListUserResult = {};
      await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
        .post(API_PATH.search_list_user, ids, {
          headers: { Authorization: `Bearer ${API_STUFF.token}` },
        })
        .then((response: any) => {
          Object.assign(searchListUserResult, {
            status: API_RESPONSE_STATUS.SUCCESS,
            data: response.data,
          });
        });

      return searchListUserResult;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        message: customErr,
      };
    }
  }
}
export { UnibertyServices };
