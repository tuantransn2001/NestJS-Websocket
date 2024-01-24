import { z } from 'zod';
import {
  LocalFileSchema,
  CreateLocalFileSchema,
  DeleteLocalFileSchema,
  UpdateLocalFileSchema,
} from './localFile.schema';

export type ILocalFile = z.infer<typeof LocalFileSchema>;
export type CreateLocalFileDto = z.infer<typeof CreateLocalFileSchema>;
export type DeleteLocalFileDto = z.infer<typeof DeleteLocalFileSchema>;
export type UpdateLocalFileDto = z.infer<typeof UpdateLocalFileSchema>;
