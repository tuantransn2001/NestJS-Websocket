import { INoSQLBaseRepository } from '../../common/repository/nosql/ibase.nosql.repository';
import { INotification } from '../shared/notification.interface';

export interface INotificationRepository
  extends INoSQLBaseRepository<INotification> {
  findByUser({
    memberId,
    memberType,
    limit,
    offset,
  }: {
    memberId: string;
    memberType: string;
    limit: number;
    offset: number;
  }): Promise<FindAllResponse<INotification>>;
}
