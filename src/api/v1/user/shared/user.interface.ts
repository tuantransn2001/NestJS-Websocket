import { z } from 'zod';
import { AddAvatarSchema, GetOneSchema, UserSchema } from './user.schema';

export type IUser = z.infer<typeof UserSchema>;
export type GetOneDto = z.infer<typeof GetOneSchema>;
export type AddAvatarDto = z.infer<typeof AddAvatarSchema>;
