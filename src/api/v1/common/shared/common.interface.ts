import { z } from 'zod';
import { BaseEntitySchema, PaginationType, UUIDType } from './common.schema';

export type IBaseEntity = z.infer<typeof BaseEntitySchema>;
export type IPagination = z.infer<typeof PaginationType>;
export type IUUID = z.infer<typeof UUIDType>;
