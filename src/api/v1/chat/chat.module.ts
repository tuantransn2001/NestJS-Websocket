import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { Conversation } from './entities/conversation.entity';
import { UserService } from '../user/user.service';
import { MessageService } from './message.service';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';
import { LocalFileService } from '../local-file/local-file.service';
import { LocalFile } from '../local-file/entities/localFile.entity';
import { UserRepository } from '../user/repository/user.repository';
import { LocalFileRepository } from '../local-file/repository/localfile.repository';
import { NotificationRepository } from '../notification/repository/notification.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFile),
    ...modelDefineProvider(ModelName.CONVERSATION, Conversation),
    ...modelDefineProvider(ModelName.NOTIFICATION, Notification),
    ChatGateway,
    ChatService,
    UserService,
    MessageService,
    NotificationService,
    LocalFileService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'LocalFileRepository',
      useValue: LocalFileRepository,
    },
    {
      provide: 'NotificationRepository',
      useValue: NotificationRepository,
    },
  ],
})
class ChatModule {}

export { ChatModule };
