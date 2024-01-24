import { Module } from '@nestjs/common';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { DatabaseModule } from '../database/database.module';

import { ModelName } from '../common/enums/common';
import { HealthCheck } from './entities/healthCheck.entity';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from './healthCheck.service';
import { TerminusModule } from '@nestjs/terminus';
@Module({
  imports: [DatabaseModule, TerminusModule],
  controllers: [HealthCheckController],
  providers: [
    ...modelDefineProvider(ModelName.HEALTH_CHECK, HealthCheck),
    HealthCheckService,
  ],
})
export class HealthCheckModule {}
