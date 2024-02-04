import { Inject, Injectable } from '@nestjs/common';
import { NoSQLBaseRepositoryAbstract } from '../../common/repository/nosql/base.nosql.repository';
import { INotification } from '../shared/notification.interface';
import { INotificationRepository } from './inotification.repository';
import { Model } from 'mongoose';
import { map as asyncMap } from 'awaity/esm';
import { ModelName } from '../../common/enums/common';
import { IUserRepository } from '../../user/repository/iuser.repository';

@Injectable()
export abstract class NotificationRepository
  extends NoSQLBaseRepositoryAbstract<INotification>
  implements INotificationRepository
{
  constructor(
    @Inject(ModelName.NOTIFICATION)
    private readonly notificationModel: Model<INotification>,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super(notificationModel);
  }

  public async findByUser({
    userId,
    userType,
    limit,
    offset,
  }: {
    userId: string;
    userType: string;
    limit: number;
    offset: number;
  }): Promise<FindAllResponse<INotification>> {
    const condition = {
      'receiver.id': userId,
      'receiver.type': userType,
    };

    const notifications = await this.notificationModel
      .find(condition)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const count = await this.notificationModel.count(condition);

    const items = await asyncMap(
      notifications,
      async (notification: INotification) => {
        return {
          ...notification,
          receiver: await this.userRepository.findUniq(
            notification.receiver.id,
          ),
          sender: await this.userRepository.findUniq(notification.sender.id),
        };
      },
    );
    return { count, items };
  }
}
