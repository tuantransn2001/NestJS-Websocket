import { z } from 'zod';
import {
  BaseEntitySchema,
  BooleanType,
  PaginationType,
  StringType,
  UUIDType,
} from '../../common/shared/common.schema';
import { NotificationType as NotificationTypeEnum } from '../../chat/constants/notification';
import { USER_TYPE } from '../../user/enum';
export const NotificationType = z
  .object({
    title: StringType,
    description: StringType,
    icon: StringType,
    type: z.nativeEnum(NotificationTypeEnum),
    read: BooleanType,
    sender: z.object({
      id: UUIDType,
      type: z.nativeEnum(USER_TYPE),
    }),
    receiver: z.object({
      id: UUIDType,
      type: z.nativeEnum(USER_TYPE),
    }),
  })
  .merge(BaseEntitySchema);

export const GetAllUserNotificationSchema = z
  .object({
    userId: UUIDType,
    userType: z.nativeEnum(USER_TYPE),
  })
  .merge(PaginationType);

export const CreateUserNotificationSchema = NotificationType.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const MarkReadNotificationSchema = z.object({ id: UUIDType });

export const RemoveNotificationSchema = z.object({ id: UUIDType });
