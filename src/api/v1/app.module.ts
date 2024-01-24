import * as dotenv from 'dotenv';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { HealthCheckModule } from './health-check/healthCheck.module';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { KnexModule } from 'nestjs-knex';
import { UserModule } from './user/user.module';
import { LocalFileModule } from './local-file/local-file.module';
import { ConfigModule } from '@nestjs/config';
import { HttpAuthMiddleware } from './common/middleware/httpAuth.middleware';

dotenv.config();

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => {
        return {
          config: {
            client: 'pg',
            connection: process.env.POSTGRESQL_DB_CONNECT_LINK,
            migrations: {
              directory: './src/api/v1/database/knex/migrations',
              extension: 'ts',
              loadExtensions: ['.ts'],
            },
            seeds: {},
            debug: false,
          },
        };
      },
    }),
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
    DatabaseModule,
    AuthModule,
    UserModule,
    ChatModule,
    HealthCheckModule,
    LocalFileModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpAuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/register', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
