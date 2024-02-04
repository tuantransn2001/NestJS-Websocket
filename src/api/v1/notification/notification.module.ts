import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '../database/database.module';
import { ModelName } from '../common/enums/common';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { NotificationSchema } from './entities/notification.entity';
import { UserService } from '../user/user.service';
import { NotificationRepository } from './repository/notification.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.NOTIFICATION, NotificationSchema),
    NotificationService,
    UserService,
    {
      provide: 'NotificationRepository',
      useValue: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
