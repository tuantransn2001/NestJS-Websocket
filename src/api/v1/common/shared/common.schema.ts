import { z } from 'zod';

export const StringType = z.string();
export const UUIDType = z.string().uuid();
export const BooleanType = z.boolean();
export const BaseEntitySchema = z.object({
  id: StringType,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const PaginationType = z.object({
  page_size: z.number(),
  page_number: z.number(),
});
