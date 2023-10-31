import { Module } from '@nestjs/common';
import { modelDefineProvider } from '../common/provider';
import { DatabaseModule } from '../database/database.module';

import { MODEL_NAME } from '../common/enums/common';
import { HealthCheck } from './entities/healthCheck.entity';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from './healthCheck.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthCheckController],
  providers: [
    ...modelDefineProvider(MODEL_NAME.HEALTH_CHECK, HealthCheck),
    HealthCheckService,
  ],
})
export class HealthCheckModule {}
