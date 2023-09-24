import { z } from 'zod';
import { HealthCheckSchema } from './healthCheck.schema';

export type IHealthCheck = z.infer<typeof HealthCheckSchema>;
