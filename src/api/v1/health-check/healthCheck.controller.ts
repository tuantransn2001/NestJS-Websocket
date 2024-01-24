import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './healthCheck.service';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@ApiTags('HealthCheck')
@Controller('/healthCheck')
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get('sever/screen')
  public async checkScreen() {
    return this.healthCheckService.checkServerScreen();
  }
  @Get('/db/mongoose')
  public async checkMongooseConnection() {
    return this.healthCheckService.checkMongooseConnection();
  }
  @Get('db/knex')
  @HealthCheck()
  public async checkKenxConnection() {
    return this.healthCheckService.checkKnexConnection();
  }
}
