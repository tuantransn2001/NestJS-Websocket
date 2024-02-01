import * as dotenv from 'dotenv';
dotenv.config();

import { KnexModule } from 'nestjs-knex';
import { Module } from '@nestjs/common';
import { databaseProviders as mongooseDatabaseProviders } from './provider/mongoose-connection.provider';
import { databaseProviders as knexDatabaseProviders } from './provider/knex-connection.provider';
import { User } from './knex/models/user.model';
import { DatabaseHealthIndicator } from './database.health';

const models = [User];

const modelProviders = models.map((model) => ({
  provide: model.name,
  useValue: model,
}));
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
  ],
  providers: [
    ...modelProviders,
    ...mongooseDatabaseProviders,
    ...knexDatabaseProviders,
    DatabaseHealthIndicator,
  ],
  exports: [
    ...modelProviders,
    ...mongooseDatabaseProviders,
    ...knexDatabaseProviders,
    DatabaseHealthIndicator,
  ],
})
export class DatabaseModule {}
