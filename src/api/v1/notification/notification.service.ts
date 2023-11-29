import { Inject, Injectable } from '@nestjs/common';
import { ModelName } from '../common/enums/common';
import { Model } from 'mongoose';
import {
  GetAllUserNotificationDto,
  INotification,
} from './shared/notification.interface';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(ModelName.NOTIFICATION)
    private readonly notificationModel: Model<INotification>,
  ) {}

  public async getAll(payload: GetAllUserNotificationDto) {
    const foundUserNoti = await this.notificationModel.find({
      'user.id': payload.userId,
      'user.type': payload.userType,
    });

    return foundUserNoti;
    // todo...
  }
  public async getOne() {
    // todo...
  }
  public async markRead() {
    // todo...
  }
  public async create() {
    // todo...
  }
  public async delete() {
    // todo...
  }
}
