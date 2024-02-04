import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { ConversationSchema } from './entities/conversation.entity';
import { UserService } from '../user/user.service';
import { MessageService } from './message.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationSchema } from '../notification/entities/notification.entity';
import { LocalFileService } from '../local-file/local-file.service';
import { LocalFileSchema } from '../local-file/entities/localFile.entity';
import { UserRepository } from '../user/repository/user.repository';
import { LocalFileRepository } from '../local-file/repository/localfile.repository';
import { NotificationRepository } from '../notification/repository/notification.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFileSchema),
    ...modelDefineProvider(ModelName.CONVERSATION, ConversationSchema),
    ...modelDefineProvider(ModelName.NOTIFICATION, NotificationSchema),
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
    {
      provide: 'MessageService',
      useClass: MessageService,
    },
  ],
})
export class ChatModule {}
