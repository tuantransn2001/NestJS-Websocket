import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '../database/database.module';
import { ModelName } from '../common/enums/common';
import { modelDefineProvider } from '../common/provider';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.NOTIFICATION, Notification),
    NotificationService,
  ],
})
export class NotificationModule {}
