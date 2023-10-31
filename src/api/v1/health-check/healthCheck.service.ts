import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { healthCheck } from '../common';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';
import { MODEL_NAME } from '../common/enums/common';
import { RestFullAPI } from '../utils/apiResponse';
import { errorHandler } from '../utils/errorHandler';
import { HttpException } from '../utils/http.exception';
import { IHealthCheck } from './shared/healthCheck.interface';

@Injectable()
export class HealthCheckService {
  constructor(
    @Inject(MODEL_NAME.HEALTH_CHECK)
    private healthCheckModel: Model<IHealthCheck>,
  ) {}

  public checkScreen() {
    try {
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        healthCheck,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async checkDB() {
    try {
      const checkData = await this.healthCheckModel.findOneAndUpdate(
        { event: 'check' },
        { event: 'check' },
        {
          new: true,
          upsert: true,
        },
      );

      const isUp: boolean = checkData !== undefined;

      if (isUp) {
        return RestFullAPI.onSuccess(
          STATUS_CODE.OK,
          STATUS_MESSAGE.SUCCESS,
          checkData,
        );
      } else {
        return RestFullAPI.onFail(STATUS_CODE.SERVICE_UNAVAILABLE, {
          message: STATUS_MESSAGE.SERVICE_UNAVAILABLE,
        } as HttpException);
      }
    } catch (err) {
      return errorHandler(err);
    }
  }
}
