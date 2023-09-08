import { z } from 'zod';
import {
  DeleteConversationSchema,
  DeleteMessageSchema,
  JoinRoomSchema,
  RequestContactListSchema,
  RequestMessageSchema,
  SearchUserByNameSchema,
  SendRoomMessageSchema,
  TypingSchema,
} from '../../shared/chat.shema';

export type JoinRoomDTO = z.infer<typeof JoinRoomSchema>;
export type SendRoomMessageDTO = z.infer<typeof SendRoomMessageSchema>;
export type TypingDTO = z.infer<typeof TypingSchema>;
export type DeleteMessageDTO = z.infer<typeof DeleteMessageSchema>;
export type DeleteConversationDTO = z.infer<typeof DeleteConversationSchema>;
export type RequestRoomMessageDTO = z.infer<typeof RequestMessageSchema>;
export type RequestContactListDTO = z.infer<typeof RequestContactListSchema>;
export type SearchUserByNameDTO = z.infer<typeof SearchUserByNameSchema>;
