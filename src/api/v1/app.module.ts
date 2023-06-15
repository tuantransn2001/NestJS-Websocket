import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ConversationModule } from './conversation/conversation.module';
import { HealthCheckModule } from './health-check/healthCheck.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConversationModule,
    HealthCheckModule,
    ChatModule,
  ],
})
export class AppModule {}
