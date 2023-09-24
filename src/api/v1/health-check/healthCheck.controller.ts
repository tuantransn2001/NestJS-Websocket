import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './healthCheck.service';
@Controller('/healthCheck')
class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get('/screen')
  public async checkScreen() {
    return this.healthCheckService.checkScreen();
  }
  @Get('/db')
  public async checkDB() {
    return this.healthCheckService.checkDB();
  }
}

export { HealthCheckController };
