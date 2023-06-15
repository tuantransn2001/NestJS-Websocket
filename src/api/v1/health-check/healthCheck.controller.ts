import { Controller, Get } from '@nestjs/common';
import { HealthCheckServices } from './healthCheck.service';
@Controller('/healthCheck')
class HealthCheckController {
  constructor(private healthCheckServices: HealthCheckServices) {}

  @Get('/screen')
  async checkScreen() {
    return this.healthCheckServices.checkScreen();
  }
  @Get('/db')
  async checkDB() {
    return this.healthCheckServices.checkDB();
  }
}

export { HealthCheckController };
