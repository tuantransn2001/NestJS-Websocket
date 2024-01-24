import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Knex } from 'knex';
import { ProviderName } from '../common/enums/common';

const KEY = 'database';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(DatabaseHealthIndicator.name);
  constructor(@Inject(ProviderName.KNEX_CONNECTION) private knex: Knex) {
    super();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.knex.raw('SELECT 1+1 as result');
      return this.getStatus(KEY, true, { status: 'up' });
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw new HealthCheckError(
        'Database connection failed',
        this.getStatus(KEY, true, { status: 'down' }),
      );
    }
  }
}
