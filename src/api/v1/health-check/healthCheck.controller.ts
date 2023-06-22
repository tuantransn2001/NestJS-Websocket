import { Controller, Get } from '@nestjs/common';
import { HealthCheckServices } from './healthCheck.service';
@Controller('/healthCheck')
class HealthCheckController {
  constructor(private healthCheckServices: HealthCheckServices) {}

  @Get('/screen')
  public async checkScreen() {
    return this.healthCheckServices.checkScreen();
  }
  @Get('/db')
  public async checkDB() {
    return this.healthCheckServices.checkDB();
  }
}

export { HealthCheckController };
