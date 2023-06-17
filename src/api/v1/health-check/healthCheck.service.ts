import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { healthCheck } from '../common';
import { STATUS_CODE, STATUS_MESSAGE } from '../ts/enums/api_enums';
import { MODEL_NAME } from '../ts/enums/model_enums';
import { HealthCheck } from '../ts/types/common';
import { RestFullAPI } from '../ts/utils/apiResponse';
import { HttpException } from '../ts/utils/http.exception';

@Injectable()
class HealthCheckServices {
  constructor(
    @Inject(MODEL_NAME.HEALTH_CHECK)
    private healthCheckModel: Model<HealthCheck>,
  ) {}

  public checkScreen() {
    try {
      return RestFullAPI.onSuccess(
        STATUS_CODE.STATUS_CODE_200,
        STATUS_MESSAGE.SUCCESS,
        healthCheck,
      );
    } catch (error) {
      return RestFullAPI.onFail(STATUS_CODE.STATUS_CODE_500, {
        status: STATUS_CODE.STATUS_CODE_503,
        message: error.message,
      } as HttpException);
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
          STATUS_CODE.STATUS_CODE_200,
          STATUS_MESSAGE.SUCCESS,
          checkData,
        );
      } else {
        return RestFullAPI.onFail(STATUS_CODE.STATUS_CODE_503, {
          message: STATUS_MESSAGE.SERVICES_UNAVAILABLE,
        } as HttpException);
      }
    } catch (error) {
      return RestFullAPI.onFail(STATUS_CODE.STATUS_CODE_500, {
        status: STATUS_CODE.STATUS_CODE_503,
        message: error.message,
      } as HttpException);
    }
  }
}

export { HealthCheckServices };
