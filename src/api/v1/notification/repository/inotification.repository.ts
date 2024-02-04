import { INoSQLBaseRepository } from '../../common/repository/nosql/ibase.nosql.repository';
import { INotification } from '../shared/notification.interface';

export interface INotificationRepository
  extends INoSQLBaseRepository<INotification> {
  findByUser({
    userId,
    userType,
    limit,
    offset,
  }: {
    userId: string;
    userType: string;
    limit: number;
    offset: number;
  }): Promise<FindAllResponse<INotification>>;
}
