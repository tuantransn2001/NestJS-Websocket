import { z } from 'zod';
import {
  ConversationType,
  MemberType,
  MemberTypeArray,
  MessageType,
  MessageTypeArray,
  UserType,
  UUIDType,
  ConversationTypeArray,
  PaginationType,
} from './chat.shema';

export type UUIDType = z.infer<typeof UUIDType>;
export type MemberType = z.infer<typeof MemberType>;
export type MemberTypeArray = z.infer<typeof MemberTypeArray>;
export type PaginationType = z.infer<typeof PaginationType>;
export type MessageType = z.infer<typeof MessageType>;
export type MessageTypeArray = z.infer<typeof MessageTypeArray>;
export type UserType = z.infer<typeof UserType>;
// ? Use for service
export type IConversation = z.infer<typeof ConversationType>;
export type ConversationTypeArray = z.infer<typeof ConversationTypeArray>;
