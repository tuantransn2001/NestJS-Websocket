import { z } from 'zod';

export const HealthCheckSchema = z.object({
  uptime: z.number(),
  message: z.string().or(
    z.object({
      status: z.number(),
      message: z.string(),
    }),
  ),
  timestamp: z.date(),
});
