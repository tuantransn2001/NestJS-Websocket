import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { modelDefineProvider } from '../common/provider';
import { MODEL_NAME } from '../ts/enums/common';
import { ConversationSchema } from '../schema/conversation.schema';
import { UnibertyServices } from '../uniberty/uniberty.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(MODEL_NAME.CONVERSATION, ConversationSchema),
    ChatGateway,
    ChatService,
    UnibertyServices,
  ],
})
class ChatModule {}

export { ChatModule };
