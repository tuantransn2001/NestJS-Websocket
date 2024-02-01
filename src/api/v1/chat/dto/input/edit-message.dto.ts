import { z } from 'zod';
import { DeleteMessageSchema } from './delete-message.dto';
import { MessageType } from '../../shared/chat.common.schema';
export const EditMessageSchema = DeleteMessageSchema.merge(
  z.object({
    dto: MessageType.omit({
      id: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      sender: true,
    }),
  }),
);

export type EditMessageDTO = z.infer<typeof EditMessageSchema>;
