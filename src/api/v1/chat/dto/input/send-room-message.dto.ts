import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { UUIDType } from 'src/api/v1/common/shared/common.schema';
import {
  MemberTypeArray,
  MessageDTOType,
} from '../../shared/chat.common.schema';
// ? => SEND ROOM MESSAGE
export const SendRoomMessageSchema = z.object({
  conversationID: UUIDType.default(uuidv4()),
  members: MemberTypeArray,
  message: MessageDTOType,
});
export type SendRoomMessageDTO = z.infer<typeof SendRoomMessageSchema>;
