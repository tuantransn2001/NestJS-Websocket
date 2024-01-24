import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '../database/database.module';
import { ModelName } from '../common/enums/common';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { Notification } from './entities/notification.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.NOTIFICATION, Notification),
    NotificationService,
    UserService,
  ],
})
export class NotificationModule {}
