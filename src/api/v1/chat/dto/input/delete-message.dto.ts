import { z } from 'zod';
import { UUIDType } from 'src/api/v1/common/shared/common.schema';
export const DeleteMessageSchema = z.object({
  messageID: UUIDType,
  conversationID: UUIDType,
});
export type DeleteMessageDTO = z.infer<typeof DeleteMessageSchema>;
