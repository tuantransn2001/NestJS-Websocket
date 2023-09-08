import axios from 'axios';
import { Agent } from 'https';

type CreateInstancePayload = {
  baseURL: string;
  token?: string;
};
const agent = new Agent({
  rejectUnauthorized: false,
});

export class Axios {
  private static URL: string = process.env.UNIBERTY_BASE_URL;

  public static createInstance({ baseURL, token }: CreateInstancePayload) {
    return axios.create({
      baseURL: baseURL || Axios.URL,
      httpsAgent: agent,
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}
