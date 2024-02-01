import { z } from 'zod';
import { UUIDType } from 'src/api/v1/common/shared/common.schema';
export const JoinRoomSchema = z.object({
  roomID: UUIDType,
});
export type JoinRoomDTO = z.infer<typeof JoinRoomSchema>;
