import { z } from 'zod';
import { StringType } from 'src/api/v1/common/shared/common.schema';
export const RequestNotificationSchema = z.object({
  user_id: StringType,
  user_type: StringType,
});
export type RequestNotificationDto = z.infer<typeof RequestNotificationSchema>;
