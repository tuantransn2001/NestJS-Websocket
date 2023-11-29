import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { modelDefineProvider } from '../common/provider';
import { ModelName } from '../common/enums/common';
import { Conversation } from './entities/conversation.entity';
import { UserService } from '../user/user.service';
import { MessageService } from './message.service';
import { Notification } from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.CONVERSATION, Conversation),
    ...modelDefineProvider(ModelName.NOTIFICATION, Notification),
    ChatGateway,
    ChatService,
    UserService,
    MessageService,
    NotificationService,
  ],
})
class ChatModule {}

export { ChatModule };
