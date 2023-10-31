import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { modelDefineProvider } from '../common/provider';
import { MODEL_NAME } from '../common/enums/common';
import { Conversation } from './entities/conversation.entity';
import { UnibertyService } from '../uniberty/uniberty.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(MODEL_NAME.CONVERSATION, Conversation),
    ChatGateway,
    ChatService,
    UnibertyService,
  ],
})
class ChatModule {}

export { ChatModule };
