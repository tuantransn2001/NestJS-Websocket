import axios from 'axios';
import { API_STUFF } from '../enums/api_enums';

export class RestFullAPIRequest {
  public static URL: string = API_STUFF.uniberty_baseURL;
  public static token: string = API_STUFF.token;

  public static createInstance(baseURL: string | null) {
    return axios.create({
      baseURL: baseURL ? baseURL : RestFullAPIRequest.URL,
    });
  }
}
