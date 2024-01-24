import { z } from 'zod';
import {
  CreateUserNotificationSchema,
  GetAllUserNotificationSchema,
  MarkReadNotificationSchema,
  NotificationType,
  RemoveNotificationSchema,
} from './notification.schema';

export type INotification = z.infer<typeof NotificationType>;
export type GetAllUserNotificationDto = z.infer<
  typeof GetAllUserNotificationSchema
>;
export type CreateUserNotificationDto = z.infer<
  typeof CreateUserNotificationSchema
>;
export type MarkReadNotificationDto = z.infer<
  typeof MarkReadNotificationSchema
>;
export type RemoveNotificationDto = z.infer<typeof RemoveNotificationSchema>;
