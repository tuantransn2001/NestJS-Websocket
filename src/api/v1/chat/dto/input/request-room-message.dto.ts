import { z } from 'zod';
import {
  PaginationType,
  StringType,
} from 'src/api/v1/common/shared/common.schema';
import { MemberTypeArray } from '../../shared/chat.common.schema';
export const RequestMessageSchema = z.object({
  sort: z.object({
    id: StringType.optional(),
    members: MemberTypeArray.optional(),
  }),
  pagination: PaginationType.optional(),
});

export type RequestRoomMessageDTO = z.infer<typeof RequestMessageSchema>;
