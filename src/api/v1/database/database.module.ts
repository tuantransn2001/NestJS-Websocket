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
