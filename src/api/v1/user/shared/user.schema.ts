import * as dotenv from 'dotenv';
import { z } from 'zod';
import {
  BaseEntitySchema,
  StringType,
} from '../../common/shared/common.schema';
import { FileHandler } from '../../utils/fileHandler';

dotenv.config();

export const UserSchema = z
  .object({
    phone: z.string().optional(),
    email: z.string().optional(),
    password: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    middle_name: z.string(),
    avatar: z.string(),
    is_active: z.boolean().default(true),
    is_reported: z.boolean().default(false),
    is_blocked: z.boolean().default(false),
    last_active_at: z.date().optional(),
  })
  .merge(BaseEntitySchema);

export const GetOneSchema = z.object({
  id: z.string(),
});

export const AddAvatarSchema = z.object({
  id: StringType,
  file: z
    .any()
    .refine((file) => file.size < process.env.MAX_FILE_SIZE, 'Max size is 3MB.') // file size validation
    .refine(
      (file) => FileHandler.checkFileType(file),
      'Only .jpg, .gif, .png formats are supported.',
    ),
});
