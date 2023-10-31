import axios from 'axios';

type CreateInstancePayload = {
  baseURL: string;
  token?: string;
};

export class Axios {
  private static URL: string = process.env.UNIBERTY_BASE_URL;

  public static createInstance({ baseURL, token }: CreateInstancePayload) {
    return axios.create({
      baseURL: baseURL || Axios.URL,
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}
