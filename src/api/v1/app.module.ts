import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { HealthCheckModule } from './health-check/healthCheck.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { LocalFileModule } from './localFile/localFile.module';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LocalFileModule,
    ChatModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
