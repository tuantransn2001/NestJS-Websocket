import { z } from 'zod';
import {
  BaseEntitySchema,
  StringType,
  UUIDType,
} from '../../common/shared/common.schema';

export const LocalFileSchema = z
  .object({
    fileName: StringType,
    path: StringType,
    mimeType: StringType,
  })
  .merge(BaseEntitySchema);

export const CreateLocalFileSchema = z.object({
  fileName: StringType,
  path: StringType,
  mimeType: StringType,
});

export const DeleteLocalFileSchema = z.object({
  id: UUIDType,
});

export const UpdateLocalFileSchema = LocalFileSchema.partial();
