import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserNotificationDto,
  GetAllUserNotificationDto,
} from './shared/notification.interface';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api.enum';
import { handleGetPagination } from '../chat/helper';
import { GetAllUserNotificationSchema } from './shared/notification.schema';
import { IUserRepository } from '../user/repository/iuser.repository';
import { INotificationRepository } from './repository/inotification.repository';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('NotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async getAll(payload: GetAllUserNotificationDto) {
    try {
      const data = GetAllUserNotificationSchema.parse(payload);
      const foundUser = await this.userRepository.findUniq(data.userId);

      if (!foundUser) return handleErrorNotFound('User do not exist!');

      const { _skip, _limit } = handleGetPagination({
        page_number: payload.page_number,
        page_size: payload.page_size,
      });

      const foundUserNotifications =
        await this.notificationRepository.findByUser({
          userId: payload.userId,
          userType: payload.userType,
          limit: _limit,
          offset: _skip,
        });

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
    return await this.notificationRepository.findOneById(id);
  }

  public async markRead(id: string) {
    try {
      const response = await this.notificationRepository.update(id, {
        read: true,
      });
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
      const response = await this.notificationRepository.create(payload);

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
      const response = await this.notificationRepository.permanentlyDelete(id);

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
