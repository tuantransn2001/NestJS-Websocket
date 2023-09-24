import { z } from 'zod';
import { StringIDType, UUIDType } from '../../chat/shared/chat.shema';

export const LocalFileSchema = z.object({
  id: UUIDType,
  fileName: StringIDType,
  path: StringIDType,
  mimetype: StringIDType,
});

export const CreateLocalFileSchema = LocalFileSchema;
