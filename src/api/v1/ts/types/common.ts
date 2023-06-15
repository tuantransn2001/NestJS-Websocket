import HttpException from '../utils/http.exception';

type HealthCheck = {
  uptime: number;
  message: string | HttpException;
  timestamp: number;
};

type ObjectType = Record<string, any>;

export { HealthCheck, ObjectType };
