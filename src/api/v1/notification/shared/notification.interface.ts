import { z } from 'zod';
import {
  GetAllUserNotification,
  NotificationType,
} from './notification.schema';

export type INotification = z.infer<typeof NotificationType>;
export type GetAllUserNotificationDto = z.infer<typeof GetAllUserNotification>;
