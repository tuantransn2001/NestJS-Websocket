import { z } from 'zod';
import { MemberType } from '../../shared/chat.common.schema';
import { PaginationType } from 'src/api/v1/common/shared/common.schema';
export const RequestContactListSchema = z.object({
  sort: MemberType,
  pagination: PaginationType.optional(),
});
export type RequestContactListDTO = z.infer<typeof RequestContactListSchema>;
