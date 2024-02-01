import { z } from 'zod';
import { StringType, UUIDType } from '../../common/shared/common.schema';
// ? Variable Declarations
export const MemberType = z.object({
  id: StringType,
  type: z.string(),
});
export const MessageType = z.object({
  id: StringType,
  isDelete: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sender: MemberType,
  content: z.string(),
});

export const MessageDTOType = z.object({
  sender: MemberType,
  content: z.string(),
});

export const UserType = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  avatar: z.string(),
});
export const MessageTypeArray = z.array(MessageType);
export const MemberTypeArray = z.array(MemberType);
export const ConversationType = z.object({
  id: UUIDType,
  name: z.string(),
  members: MemberTypeArray,
  messages: MessageTypeArray,
  isDelete: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ConversationTypeArray = z.array(ConversationType);
