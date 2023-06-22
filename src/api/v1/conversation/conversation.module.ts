import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ConversationController } from './conversation.controller';
import { ConversationServices } from './conversation.service';
import { UnibertyServices } from '../uniberty/uniberty.service';
import { modelDefineProvider } from '../common/provider';
import { MODEL_NAME } from '../ts/enums/model_enums';
import { ConversationSchema } from '../schema/conversation.schema';
@Module({
  imports: [DatabaseModule],
  controllers: [ConversationController],
  providers: [
    ...modelDefineProvider(MODEL_NAME.CONVERSATION, ConversationSchema),
    ConversationServices,
    UnibertyServices,
  ],
})
export class ConversationModule {}
