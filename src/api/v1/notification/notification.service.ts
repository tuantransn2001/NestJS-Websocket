import { Inject, Injectable } from '@nestjs/common';
import { ModelName } from '../common/enums/common';
import { Model } from 'mongoose';
import {
  CreateUserNotificationDto,
  GetAllUserNotificationDto,
  INotification,
} from './shared/notification.interface';
import { UserService } from '../user/user.service';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';
import { handleGetPagination } from '../chat/helper';
import { map as asyncMap } from 'awaity/esm';
import {
  CreateUserNotificationSchema,
  GetAllUserNotificationSchema,
} from './shared/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(ModelName.NOTIFICATION)
    private readonly notificationModel: Model<INotification>,
    private readonly userService: UserService,
  ) {}

  public async getAll(payload: GetAllUserNotificationDto) {
    try {
      const data = GetAllUserNotificationSchema.parse(payload);
      const foundUser = await this.userService.findUniq(data.userId);

      if (!foundUser) return handleErrorNotFound('User do not exist!');

      const { _skip, _limit } = handleGetPagination({
        page_number: payload.page_number,
        page_size: payload.page_size,
      });

      const foundUserNotifications = await this.notificationModel
        .find({
          'receiver.id': payload.userId,
          'receiver.type': payload.userType,
        })
        .sort({ createdAt: -1 })
        .skip(_skip)
        .limit(_limit)
        .lean()
        .exec()
        .then(
          async (notifications) =>
            await asyncMap(
              notifications,
              async (notification: INotification) => {
                const receiver = await this.userService.findUniq(
                  notification.receiver.id,
                );
                const sender = await this.userService.findUniq(
                  notification.sender.id,
                );

                return {
                  ...notification,
                  sender,
                  receiver,
                };
              },
            ),
        );

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        foundUserNotifications,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async getOne(id: string) {
    return await this.notificationModel.findOne({ id }).lean();
  }
  public async markRead(id: string) {
    try {
      const response = await this.notificationModel.findOneAndUpdate(
        {
          id,
        },
        {
          read: true,
        },
        {
          new: true,
        },
      );
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        response,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async create(payload: CreateUserNotificationDto) {
    try {
      const data = CreateUserNotificationSchema.parse(payload);
      const response = await this.notificationModel.create(data);

      return RestFullAPI.onSuccess(
        STATUS_CODE.CREATED,
        STATUS_MESSAGE.SUCCESS,
        response,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async remove(id: string) {
    try {
      const response = await this.notificationModel.findOneAndDelete({ id });
      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        response,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
}
