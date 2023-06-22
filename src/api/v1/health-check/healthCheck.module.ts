import { Module } from '@nestjs/common';
import { modelDefineProvider } from '../common/provider';
import { DatabaseModule } from '../database/database.module';
import { HealthCheckSchema } from '../schema/healthCheck.schema';
import { MODEL_NAME } from '../ts/enums/model_enums';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckServices } from './healthCheck.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthCheckController],
  providers: [
    ...modelDefineProvider(MODEL_NAME.HEALTH_CHECK, HealthCheckSchema),
    HealthCheckServices,
  ],
})
export class HealthCheckModule {}
