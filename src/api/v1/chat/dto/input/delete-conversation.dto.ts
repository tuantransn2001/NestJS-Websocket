import { z } from 'zod';
import { StringType } from 'src/api/v1/common/shared/common.schema';
export const DeleteConversationSchema = z.object({ id: StringType });
export type DeleteConversationDTO = z.infer<typeof DeleteConversationSchema>;
