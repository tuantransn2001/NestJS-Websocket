import { z } from 'zod';
import { MemberType } from '../../shared/chat.common.schema';

export const TypingSchema = z.object({
  sender: MemberType,
  isTyping: z.boolean(),
});

export type TypingDTO = z.infer<typeof TypingSchema>;
