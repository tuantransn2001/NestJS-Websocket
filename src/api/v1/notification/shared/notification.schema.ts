import { z } from 'zod';
import {
  BaseEntitySchema,
  BooleanType,
  PaginationType,
  StringType,
  UUIDType,
} from '../../common/shared/common.schema';
import { NotificationType as NotificationTypeEnum } from '../../chat/constants/notification_constants';
import { UserType } from '../../user/enum';
export const NotificationType = z
  .object({
    title: StringType,
    description: StringType,
    icon: StringType,
    type: z.nativeEnum(NotificationTypeEnum),
    read: BooleanType,
    user: z.object({
      id: UUIDType,
      type: z.nativeEnum(UserType),
    }),
  })
  .merge(BaseEntitySchema);

export const GetAllUserNotification = z
  .object({
    userId: UUIDType,
    userType: z.nativeEnum(UserType),
  })
  .merge(PaginationType);
