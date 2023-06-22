import { HttpException } from '../utils/http.exception';

export type HealthCheck = {
  uptime: number;
  message: string | HttpException;
  timestamp: number;
};

export type ObjectType = Record<string, any>;
